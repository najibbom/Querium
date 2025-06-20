'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { ChatInterface } from '@/components/chat/chat-interface';
import { DocumentUpload } from '@/components/document/document-upload';
import { DocumentList } from '@/components/document/document-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  processed: boolean;
}

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
    // Load documents from localStorage on component mount
    const savedDocuments = localStorage.getItem('documents');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const handleDocumentUploaded = (document: Document) => {
    const updatedDocuments = [...documents, document];
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  };

  const handleDocumentDeleted = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    if (selectedDocument === documentId) {
      setSelectedDocument(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
            <Image 
              src={"/images/" + (theme === 'dark' ? 'logotype_wh' : 'logotype') + ".png"} 
              alt="Logotype" 
              width={200} 
              height={200} 
              className='pb-4'
            />
          <p className="text-sm text-muted-foreground ml-6">
            Upload your documents and get intelligent answers powered by AI
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-0">
            <ChatInterface 
              documents={documents} 
              selectedDocument={selectedDocument}
              onDocumentSelect={setSelectedDocument}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
            <DocumentList 
              documents={documents} 
              onDocumentDeleted={handleDocumentDeleted}
              selectedDocument={selectedDocument}
              onDocumentSelect={setSelectedDocument}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}