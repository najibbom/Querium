import os
from typing import Dict, Any, Optional, List
import logging

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self, vector_store):
        self.vector_store = vector_store
        
    async def get_response(self, message: str, document_id: Optional[str] = None) -> Dict[str, Any]:
        """Get AI response to user message"""
        try:
            # Search for relevant documents
            relevant_docs = self.vector_store.search(message, document_id)
            
            # Build context from relevant documents
            context = ""
            sources = []
            
            for doc in relevant_docs[:3]:  # Use top 3 most relevant documents
                context += f"Document: {doc['metadata']['filename']}\n"
                context += f"Content: {doc['content']}\n\n"
                sources.append(doc['metadata']['filename'])
            
            # Generate response (simplified for demonstration)
            if context:
                response = f"Based on the uploaded documents, here's what I found regarding your question: '{message}'\n\n"
                response += "The relevant information from your documents suggests that you should refer to the specific content in the uploaded files. "
                response += "This is a simplified response - in a full implementation, this would use OpenAI's API to generate intelligent responses based on the document context."
            else:
                response = "I couldn't find relevant information in your uploaded documents to answer that question. Please make sure you've uploaded documents that contain information related to your query."
            
            return {
                "answer": response,
                "sources": sources
            }
            
        except Exception as e:
            logger.error(f"Error generating chat response: {str(e)}")
            return {
                "answer": "I'm sorry, I encountered an error while processing your request. Please try again.",
                "sources": []
            }