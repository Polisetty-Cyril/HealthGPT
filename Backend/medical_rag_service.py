#!/usr/bin/env python3
"""
Medical RAG Service - Python backend for the medical question answering system
This service hosts the RAG pipeline from the Colab notebook
"""

import os
import sys
import json
import logging
from typing import Dict, List, Any, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoModelForSeq2SeqLM
from datasets import load_dataset
import torch

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class MedicalRAGService:
    def __init__(self):
        """Initialize the medical RAG service with models and vector databases"""
        self.embedder = None
        self.hyde_tokenizer = None
        self.hyde_model = None
        self.reranker_tokenizer = None
        self.reranker_model = None
        self.vector_dbs = {}
        self.initialized = False
        
    def initialize_models(self):
        """Initialize all required models and vector databases"""
        try:
            logger.info("Initializing Medical RAG Service...")
            
            # Initialize embedder
            logger.info("Loading sentence transformer...")
            self.embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
            
            # Initialize HyDE model
            logger.info("Loading HyDE model...")
            hyde_model_name = "microsoft/BioGPT"
            self.hyde_tokenizer = AutoTokenizer.from_pretrained(hyde_model_name)
            self.hyde_model = AutoModelForCausalLM.from_pretrained(hyde_model_name)
            
            # Initialize reranker model
            logger.info("Loading reranker model...")
            reranker_model_name = "google/flan-t5-large"
            self.reranker_tokenizer = AutoTokenizer.from_pretrained(reranker_model_name)
            self.reranker_model = AutoModelForSeq2SeqLM.from_pretrained(reranker_model_name)
            
            # Load datasets and build vector databases
            logger.info("Loading medical datasets...")
            self._load_datasets()
            
            self.initialized = True
            logger.info("Medical RAG Service initialized successfully!")
            
        except Exception as e:
            logger.error(f"Failed to initialize Medical RAG Service: {str(e)}")
            raise e
    
    def _load_datasets(self):
        """Load medical datasets and build FAISS indexes"""
        try:
            # Load neurology dataset
            logger.info("Loading neurology dataset...")
            neurology_dataset = load_dataset("KryptoniteCrown/synthetic-neurology-QA-dataset", split="train")
            neurology_qa = [{"question": row["question"], "answer": row["answer"]} for row in neurology_dataset]
            
            # Load cardiology dataset
            logger.info("Loading cardiology dataset...")
            cardiology_dataset = load_dataset("ilyassacha/cardiology_qa", split="train")
            cardiology_qa = [{"question": row["question"], "answer": row["answer"]} for row in cardiology_dataset]
            
            # Load dermatology dataset
            logger.info("Loading dermatology dataset...")
            dermatology_dataset = load_dataset("Mreeb/Dermatology-Question-Answer-Dataset-For-Fine-Tuning", split="train")
            dermatology_qa = [{"question": row["prompt"], "answer": row["response"]} for row in dermatology_dataset]
            
            # Build vector databases
            self.vector_dbs = {
                "general": self._build_faiss_index(neurology_qa, "General"),
                "cardiology": self._build_faiss_index(cardiology_qa, "Cardiology"),
                "dermatology": self._build_faiss_index(dermatology_qa, "Dermatology"),
            }
            
            logger.info("Vector databases built successfully!")
            
        except Exception as e:
            logger.error(f"Failed to load datasets: {str(e)}")
            raise e
    
    def _build_faiss_index(self, docs: List[Dict], domain_name: str):
        """Build FAISS index for a domain"""
        texts = [d["question"] for d in docs]
        embeddings = self.embedder.encode(texts, convert_to_numpy=True, show_progress_bar=True)
        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings)
        
        logger.info(f"[{domain_name}] Total vectors stored: {index.ntotal}")
        return index, docs
    
    def route_pipeline(self, query: str) -> List[str]:
        """Route query to appropriate medical domain"""
        q = query.lower()
        
        cardiology_keywords = [
            "heart disease", "cardiovascular disease", "coronary artery disease", "cad",
            "myocardial infarction", "heart attack", "angina", "heart failure",
            "arrhythmia", "atrial fibrillation", "afib", "cardiomyopathy",
            "hypertension", "high blood pressure", "chest pain", "palpitations",
            "shortness of breath", "dyspnea", "ecg", "ekg", "echocardiogram",
            "angioplasty", "stent", "bypass surgery", "pacemaker", "defibrillator"
        ]
        
        dermatology_keywords = [
            "acne", "rosacea", "eczema", "dermatitis", "psoriasis", "urticaria",
            "hives", "alopecia", "hair loss", "vitiligo", "melasma", "lupus",
            "fungal infection", "tinea", "ringworm", "warts", "skin cancer",
            "basal cell carcinoma", "squamous cell carcinoma", "melanoma",
            "rash", "itching", "pruritus", "dry skin", "blister", "lesion"
        ]
        
        neurology_keywords = [
            "stroke", "migraine", "epilepsy", "seizure", "multiple sclerosis", "ms",
            "parkinson", "alzheimer", "dementia", "neuropathy", "neuralgia",
            "meningitis", "encephalitis", "brain tumor", "concussion",
            "traumatic brain injury", "tbi", "headache", "vertigo", "ataxia",
            "numbness", "tingling", "weakness", "paralysis", "memory loss",
            "tremor", "balance problems", "speech difficulty", "dizziness"
        ]
        
        if any(word in q for word in cardiology_keywords):
            return ["cardiology"]
        elif any(word in q for word in dermatology_keywords):
            return ["dermatology"]
        else:
            return ["general"]
    
    def hyde_hypothesis(self, query: str, max_new_tokens: int = 120) -> str:
        """Generate hypothetical medical answer using HyDE"""
        prompt = f"""
        You are a senior medical expert. Given the following question, create a hypothetical but medically valid answer.
        Make it structured in this exact format:

        Causes:
        - <cause 1>
        - <cause 2>
        - <cause 3>

        Treatments:
        - <treatment 1>
        - <treatment 2>
        - <treatment 3>

        Follow-up:
        - <test or next step 1>
        - <test or next step 2>

        Summary:
        <2–3 sentence summary>

        Question: {query}
        """
        
        inputs = self.hyde_tokenizer(prompt, return_tensors="pt")
        outputs = self.hyde_model.generate(**inputs, max_new_tokens=max_new_tokens, do_sample=False)
        hypo_answer = self.hyde_tokenizer.decode(outputs[0], skip_special_tokens=True)
        hypo_answer = hypo_answer.replace("< / FREETEXT >", "").replace("< / ABSTRACT >", "").strip()
        return hypo_answer.strip()
    
    def llm_rerank(self, query: str, candidate_answers: List[str]) -> List[Dict]:
        """Rerank candidate answers using LLM"""
        scored_answers = []
        
        for ans in candidate_answers:
            prompt = f"""
            Question: {query}

            Candidate Answer:
            {ans}

            On a scale of 0 to 1:
            - 1.0 = Explicitly answers this question (correct causes + treatments).
            - 0.5 = Partially related but incomplete.
            - 0.0 = Irrelevant or wrong.

            Respond ONLY with a number (0.0, 0.5, or 1.0).
            """
            
            inputs = self.reranker_tokenizer(prompt, return_tensors="pt", truncation=True)
            outputs = self.reranker_model.generate(**inputs, max_new_tokens=5)
            score_text = self.reranker_tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
            
            try:
                score = float(score_text)
            except ValueError:
                score = 0.0
            
            scored_answers.append({"answer": ans, "reranker_score": score})
        
        return sorted(scored_answers, key=lambda x: x["reranker_score"], reverse=True)
    
    def synthesize_answer(self, query: str, top_passages: List[str]) -> str:
        """Generate final structured medical answer"""
        context = "\n".join(top_passages)
        prompt = f"""
        You are a senior medical doctor. Using the retrieved passages, provide a clear and structured medical answer.

        Question: {query}

        Retrieved Passages:
        {context}

        Strictly answer in this format:

        Causes:
        - <list possible causes>

        Treatments:
        - <list standard treatments or interventions>

        Follow-up:
        - <list recommended diagnostic tests or monitoring steps>

        Summary:
        <2–3 sentence summary for the patient>
        """
        
        inputs = self.reranker_tokenizer(prompt, return_tensors="pt", truncation=True)
        outputs = self.reranker_model.generate(**inputs, max_new_tokens=350)
        return self.reranker_tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
    
    def retrieve_answer(self, query: str, k: int = 3, use_hyde: bool = True) -> Dict[str, Any]:
        """Main RAG pipeline"""
        if not self.initialized:
            raise RuntimeError("Medical RAG Service not initialized")
        
        # HyDE step
        if use_hyde:
            hypo = self.hyde_hypothesis(query)
            query_text = hypo
        else:
            query_text = query
        
        # Router
        selected_dbs = self.route_pipeline(query)
        
        # Collect candidates
        candidates = []
        query_emb = self.embedder.encode([query_text])
        for db_name in selected_dbs:
            index, docs = self.vector_dbs[db_name]
            distances, indices = index.search(np.array(query_emb), k)
            candidates.extend([docs[i]["answer"] for i in indices[0]])
        
        # Rerank with LLM
        results = self.llm_rerank(query, candidates)
        
        # Final synthesis
        top_passages = [r["answer"] for r in results[:3]]
        final_answer = self.synthesize_answer(query, top_passages)
        
        return {
            "ranked_results": results,
            "final_answer": final_answer,
            "domain": selected_dbs[0] if selected_dbs else "general"
        }

# Global service instance
rag_service = MedicalRAGService()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "initialized": rag_service.initialized
    })

@app.route('/api/medical/query', methods=['POST'])
def medical_query():
    """Main endpoint for medical queries"""
    try:
        if not rag_service.initialized:
            return jsonify({
                "error": "Medical RAG Service not initialized"
            }), 500
        
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                "error": "Query is required"
            }), 400
        
        query = data['query']
        k = data.get('k', 3)
        use_hyde = data.get('use_hyde', True)
        
        logger.info(f"Processing medical query: {query}")
        
        result = rag_service.retrieve_answer(query, k=k, use_hyde=use_hyde)
        
        return jsonify({
            "success": True,
            "query": query,
            "domain": result["domain"],
            "answer": result["final_answer"],
            "ranked_results": result["ranked_results"][:5],  # Top 5 results
            "timestamp": str(np.datetime64('now'))
        })
        
    except Exception as e:
        logger.error(f"Error processing medical query: {str(e)}")
        return jsonify({
            "error": f"Failed to process query: {str(e)}"
        }), 500

@app.route('/api/medical/initialize', methods=['POST'])
def initialize_service():
    """Initialize the medical RAG service"""
    try:
        if rag_service.initialized:
            return jsonify({
                "message": "Service already initialized",
                "initialized": True
            })
        
        rag_service.initialize_models()
        return jsonify({
            "message": "Medical RAG Service initialized successfully",
            "initialized": True
        })
        
    except Exception as e:
        logger.error(f"Failed to initialize service: {str(e)}")
        return jsonify({
            "error": f"Failed to initialize service: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Initialize the service on startup
    try:
        rag_service.initialize_models()
        logger.info("Medical RAG Service started successfully!")
    except Exception as e:
        logger.error(f"Failed to start Medical RAG Service: {str(e)}")
        sys.exit(1)
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
