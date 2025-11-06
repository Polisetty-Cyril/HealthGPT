import express from "express";
import axios from "axios";

const router = express.Router();

// Medical RAG service URL
const MEDICAL_RAG_URL = process.env.MEDICAL_RAG_URL || "http://localhost:5001";

// Proxy medical queries to Python RAG service
router.post("/query", async (req, res) => {
  try {
    const { query, k = 3, use_hyde = true } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required"
      });
    }

    // Forward request to Python RAG service
    const response = await axios.post(`${MEDICAL_RAG_URL}/api/medical/query`, {
      query,
      k,
      use_hyde
    }, {
      timeout: 30000, // 30 second timeout for medical queries
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Return the response from Python service
    res.json(response.data);

  } catch (error) {
    console.error("Medical RAG service error:", error.message);
    
    // Handle different types of errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: "Medical RAG service is unavailable",
        message: "Please ensure the Python medical service is running"
      });
    }
    
    if (error.response) {
      // Python service returned an error
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || "Medical RAG service error",
        details: error.response.data
      });
    }
    
    // Generic error
    return res.status(500).json({
      success: false,
      error: "Failed to process medical query",
      message: error.message
    });
  }
});

// Health check for medical RAG service
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${MEDICAL_RAG_URL}/health`, {
      timeout: 5000
    });
    
    res.json({
      success: true,
      medical_rag_service: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(503).json({
      success: false,
      error: "Medical RAG service unavailable",
      message: error.message
    });
  }
});

// Initialize medical RAG service
router.post("/initialize", async (req, res) => {
  try {
    const response = await axios.post(`${MEDICAL_RAG_URL}/api/medical/initialize`, {}, {
      timeout: 60000 // 1 minute timeout for initialization
    });
    
    res.json(response.data);
    
  } catch (error) {
    console.error("Failed to initialize medical RAG service:", error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || "Failed to initialize medical RAG service",
        details: error.response.data
      });
    }
    
    return res.status(500).json({
      success: false,
      error: "Failed to initialize medical RAG service",
      message: error.message
    });
  }
});

export default router;
