from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from typing import List, Optional
import uvicorn
from pydantic import BaseModel
from document_processor import DocumentProcessor
from vector_store import VectorStore
from chat_service import ChatService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Querium API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
document_processor = DocumentProcessor()
vector_store = VectorStore()
chat_service = ChatService(vector_store)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    document_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []

class DocumentInfo(BaseModel):
    id: str
    name: str
    type: str
    size: int
    processed: bool

@app.get("/")
async def root():
    return {"message": "Querium API is running"}

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Validate file type
        allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Generate unique ID
        doc_id = str(uuid.uuid4())
        
        # Read file content
        content = await file.read()
        
        # Process document
        text_content = document_processor.extract_text(content, file.content_type)
        
        # Store in vector database
        vector_store.add_document(doc_id, text_content, {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content)
        })
        
        return JSONResponse({
            "id": doc_id,
            "name": file.filename,
            "type": file.content_type,
            "size": len(content),
            "processed": True,
            "uploadedAt": "2024-01-01T00:00:00Z"
        })
        
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        response = await chat_service.get_response(
            message.message, 
            document_id=message.document_id
        )
        
        return ChatResponse(
            response=response["answer"],
            sources=response.get("sources", [])
        )
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def list_documents():
    try:
        documents = vector_store.list_documents()
        return documents
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    try:
        vector_store.delete_document(document_id)
        return {"message": "Document deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)