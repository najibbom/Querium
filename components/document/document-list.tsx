'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Trash2, Calendar, HardDrive, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  processed: boolean;
}

interface DocumentListProps {
  documents: Document[];
  onDocumentDeleted: (documentId: string) => void;
  selectedDocument: string | null;
  onDocumentSelect: (documentId: string) => void;
}

export function DocumentList({ 
  documents, 
  onDocumentDeleted, 
  selectedDocument, 
  onDocumentSelect 
}: DocumentListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOCX';
      case 'text/plain':
        return 'TXT';
      default:
        return type.split('/')[1]?.toUpperCase() || 'FILE';
    }
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No documents uploaded</h3>
          <p className="text-muted-foreground">
            Upload your first document to get started with AI-powered Q&A.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Documents</span>
          <Badge variant="secondary">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-colors ${
                selectedDocument === document.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 text-primary">
                    {getFileIcon(document.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium truncate">{document.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getFileTypeLabel(document.type)}
                      </Badge>
                      {document.processed ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Processing
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{formatFileSize(document.size)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(document.uploadedAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedDocument === document.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onDocumentSelect(document.id)}
                    disabled={!document.processed}
                  >
                    {selectedDocument === document.id ? 'Selected' : 'Select'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentDeleted(document.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}