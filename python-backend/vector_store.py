import os
from typing import List, Dict, Any, Optional
import logging
import json

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self):
        self.documents = {}  # Simple in-memory storage for now
        self.embeddings = {}
        
    def add_document(self, doc_id: str, content: str, metadata: Dict[str, Any]):
        """Add document to vector store"""
        try:
            # Store document
            self.documents[doc_id] = {
                "id": doc_id,
                "content": content,
                "metadata": metadata,
                "processed": True
            }
            
            # In a real implementation, you would generate embeddings here
            # For now, we'll just store the text content
            self.embeddings[doc_id] = content
            
            logger.info(f"Document {doc_id} added to vector store")
            
        except Exception as e:
            logger.error(f"Error adding document to vector store: {str(e)}")
            raise
    
    def search(self, query: str, document_id: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant documents"""
        try:
            results = []
            
            # Simple keyword search for demonstration
            # In a real implementation, you would use vector similarity search
            search_docs = {}
            if document_id and document_id in self.documents:
                search_docs[document_id] = self.documents[document_id]
            else:
                search_docs = self.documents
            
            for doc_id, doc_data in search_docs.items():
                content = doc_data["content"].lower()
                query_lower = query.lower()
                
                # Simple relevance scoring based on keyword matches
                score = 0
                for word in query_lower.split():
                    if word in content:
                        score += content.count(word)
                
                if score > 0:
                    results.append({
                        "id": doc_id,
                        "content": doc_data["content"][:500] + "..." if len(doc_data["content"]) > 500 else doc_data["content"],
                        "metadata": doc_data["metadata"],
                        "score": score
                    })
            
            # Sort by relevance score
            results.sort(key=lambda x: x["score"], reverse=True)
            return results[:top_k]
            
        except Exception as e:
            logger.error(f"Error searching vector store: {str(e)}")
            return []
    
    def list_documents(self) -> List[Dict[str, Any]]:
        """List all documents"""
        try:
            return [
                {
                    "id": doc_id,
                    "name": doc_data["metadata"]["filename"],
                    "type": doc_data["metadata"]["content_type"],
                    "size": doc_data["metadata"]["size"],
                    "processed": doc_data["processed"],
                    "uploadedAt": "2024-01-01T00:00:00Z"
                }
                for doc_id, doc_data in self.documents.items()
            ]
        except Exception as e:
            logger.error(f"Error listing documents: {str(e)}")
            return []
    
    def delete_document(self, doc_id: str):
        """Delete document from vector store"""
        try:
            if doc_id in self.documents:
                del self.documents[doc_id]
            if doc_id in self.embeddings:
                del self.embeddings[doc_id]
            logger.info(f"Document {doc_id} deleted from vector store")
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            raise
    
    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get specific document"""
        return self.documents.get(doc_id)