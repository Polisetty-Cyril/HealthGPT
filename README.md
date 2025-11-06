# ARAGOG - Medical RAG System

A comprehensive medical question-answering system that combines Retrieval-Augmented Generation (RAG) with multiple medical datasets to provide accurate, structured medical information.

## 🏗️ System Architecture

```
Frontend (React) ←→ Backend (Node.js) ←→ Medical RAG Service (Python)
     ↓                    ↓                        ↓
  Port 5173            Port 5000                Port 5001
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the complete system startup script
python start_system.py
```

This will:
- Check system requirements
- Install all dependencies
- Start all services
- Open the application at http://localhost:5173

### Option 2: Manual Setup

#### 1. Start Medical RAG Service (Python)

```bash
cd Backend
pip install -r requirements.txt
python medical_rag_service.py
```

#### 2. Start Backend Service (Node.js)

```bash
cd Backend
npm install
npm run dev
```

#### 3. Start Frontend Service (React)

```bash
cd Frontend/medirag-ai-main/medirag-ai-main
npm install
npm run dev
```

## 📋 System Requirements

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **8GB+ RAM** (for model loading)
- **10GB+ free disk space** (for model downloads)

## 🔧 Features

### Medical RAG Pipeline
- **HyDE (Hypothetical Document Embeddings)** for improved retrieval
- **Multi-domain routing** (Cardiology, Dermatology, Neurology)
- **LLM-based reranking** for answer quality
- **Structured medical responses** with causes, treatments, and follow-up

### Frontend Features
- **Real-time chat interface** with medical AI
- **Voice input support** (coming soon)
- **Image upload** for medical image analysis
- **Conversation history**
- **Responsive design**

### Backend Features
- **RESTful API** for medical queries
- **User authentication** (MongoDB)
- **Service health monitoring**
- **Error handling and logging**

## 📊 Medical Datasets

The system uses three specialized medical datasets:

1. **Neurology**: 1,452 Q&A pairs
2. **Cardiology**: 14,885 Q&A pairs  
3. **Dermatology**: 1,460 Q&A pairs

## 🔌 API Endpoints

### Medical RAG Service (Python - Port 5001)

- `POST /api/medical/query` - Submit medical questions
- `GET /health` - Service health check
- `POST /api/medical/initialize` - Initialize the service

### Backend Service (Node.js - Port 5000)

- `POST /api/medical/query` - Proxy to Python service
- `GET /api/health` - System health check
- `POST /api/medical/initialize` - Initialize medical service

## 🛠️ Development

### Project Structure

```
ARAGOG/
├── Backend/                    # Node.js backend
│   ├── medical_rag_service.py  # Python RAG service
│   ├── requirements.txt        # Python dependencies
│   ├── routes/                 # API routes
│   └── server.js              # Main server
├── Frontend/                   # React frontend
│   └── medirag-ai-main/
└── start_system.py            # System startup script
```

### Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medirag
MEDICAL_RAG_URL=http://localhost:5001
```

## 🧪 Testing the System

1. **Health Check**: Visit http://localhost:5000/api/health
2. **Medical Query**: Send POST request to http://localhost:5000/api/medical/query
3. **Frontend**: Open http://localhost:5173

### Example API Call

```bash
curl -X POST http://localhost:5000/api/medical/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the symptoms of heart disease?", "k": 3, "use_hyde": true}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5000, 5001, and 5173 are available
2. **Memory issues**: Close other applications to free up RAM
3. **Model download**: First run may take 10-15 minutes to download models
4. **Python dependencies**: Run `pip install -r requirements.txt`

### Logs

- **Medical Service**: Check console output for Python service logs
- **Backend Service**: Check console output for Node.js logs
- **Frontend**: Check browser console for React logs

## 📝 License

This project is for educational and research purposes. Please ensure compliance with medical data usage regulations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the logs for error messages
- Ensure all services are running on correct ports
