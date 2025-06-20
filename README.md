# LangChain Document Q&A Chatbot

A sophisticated document-based Q&A chatbot built with Next.js frontend and Python/LangChain backend. Upload documents and get intelligent answers powered by advanced AI and vector search.

## Features

- **Document Processing**: Support for PDF, DOCX, and TXT files
- **Advanced AI**: Powered by LangChain and OpenAI GPT models
- **Vector Search**: ChromaDB for efficient semantic search
- **Modern UI**: Clean, responsive interface with dark/light mode
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Source References**: AI responses include document sources
- **Document Management**: Upload, view, and delete documents

## Architecture

### Frontend (Next.js)
- Modern React components with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Responsive design with accessibility features

### Backend (Python/FastAPI)
- **LangChain**: Document processing and AI orchestration
- **ChromaDB**: Vector database for embeddings storage
- **OpenAI**: GPT models for chat responses and embeddings
- **FastAPI**: High-performance API framework

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key

### 1. Clone and Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd python-backend
pip install -r requirements.txt
cd ..
```

### 2. Environment Configuration

Create `.env` files in both root and python-backend directories:

**Root `.env`:**
```env
PYTHON_API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_api_key_here
```

**`python-backend/.env`:**
```env
OPENAI_API_KEY=your_openai_api_key_here
PYTHONPATH=.
```

### 3. Start the Application

**Option 1: Start both servers together**
```bash
npm run dev-full
```

**Option 2: Start servers separately**

Terminal 1 (Python backend):
```bash
cd python-backend
python app.py
```

Terminal 2 (Next.js frontend):
```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Python API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Usage

1. **Upload Documents**: Use the Documents tab to upload PDF, DOCX, or TXT files
2. **Start Chatting**: Switch to the Chat tab and ask questions about your documents
3. **Document Scope**: Select specific documents or search across all uploaded files
4. **View Sources**: AI responses include references to source documents

## API Endpoints

### Python Backend (FastAPI)

- `POST /api/documents/upload` - Upload and process documents
- `POST /api/chat` - Send chat messages and get AI responses
- `GET /api/documents` - List all processed documents
- `DELETE /api/documents/{id}` - Delete a specific document

### Next.js API Routes

- `POST /api/documents/upload` - Proxy to Python backend
- `POST /api/chat` - Proxy to Python backend
- `GET /api/documents` - Proxy to Python backend
- `DELETE /api/documents/[id]` - Proxy to Python backend

## Technology Stack

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **React Dropzone**: File upload handling

### Backend
- **FastAPI**: Modern Python web framework
- **LangChain**: AI application framework
- **ChromaDB**: Vector database for embeddings
- **OpenAI**: GPT models and embeddings
- **PyPDF**: PDF text extraction
- **python-docx**: DOCX text extraction

## Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API route handlers (proxy to Python)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── document/         # Document management components
│   └── ui/               # Reusable UI components
├── python-backend/        # Python/FastAPI backend
│   ├── app.py            # Main FastAPI application
│   ├── document_processor.py  # Document text extraction
│   ├── vector_store.py   # ChromaDB vector operations
│   ├── chat_service.py   # LangChain chat logic
│   └── requirements.txt  # Python dependencies
└── lib/                  # Utility functions
```

### Key Components

- **DocumentProcessor**: Handles text extraction from various file formats
- **VectorStore**: Manages ChromaDB operations and embeddings
- **ChatService**: Orchestrates LangChain for AI responses
- **ChatInterface**: React component for chat UI
- **DocumentUpload**: File upload with progress tracking

## Deployment

### Frontend Deployment
The Next.js frontend can be deployed to Vercel, Netlify, or any static hosting service.

### Backend Deployment
The Python backend can be deployed to:
- **Railway**: `railway up`
- **Heroku**: Standard Python deployment
- **Docker**: Containerized deployment
- **Cloud providers**: AWS, GCP, Azure

### Environment Variables for Production
Ensure all environment variables are properly configured in your deployment environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.