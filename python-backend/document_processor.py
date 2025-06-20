import io
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        pass
    
    def extract_text(self, content: bytes, content_type: str) -> str:
        """Extract text from document based on content type"""
        try:
            if content_type == 'text/plain':
                return content.decode('utf-8')
            elif content_type == 'application/pdf':
                return self._extract_pdf_text(content)
            elif content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return self._extract_docx_text(content)
            else:
                raise ValueError(f"Unsupported content type: {content_type}")
        except Exception as e:
            logger.error(f"Error extracting text: {str(e)}")
            raise
    
    def _extract_pdf_text(self, content: bytes) -> str:
        """Extract text from PDF"""
        try:
            from pypdf import PdfReader
            pdf_file = io.BytesIO(content)
            reader = PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except ImportError:
            logger.warning("pypdf not available, returning placeholder text")
            return "PDF content extraction requires pypdf library"
        except Exception as e:
            logger.error(f"Error extracting PDF text: {str(e)}")
            raise
    
    def _extract_docx_text(self, content: bytes) -> str:
        """Extract text from DOCX"""
        try:
            from docx import Document
            docx_file = io.BytesIO(content)
            doc = Document(docx_file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except ImportError:
            logger.warning("python-docx not available, returning placeholder text")
            return "DOCX content extraction requires python-docx library"
        except Exception as e:
            logger.error(f"Error extracting DOCX text: {str(e)}")
            raise