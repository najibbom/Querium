'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentUploadProps {
  onDocumentUploaded: (document: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    processed: boolean;
  }) => void;
}

interface UploadStatus {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export function DocumentUpload({ onDocumentUploaded }: DocumentUploadProps) {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));
    
    setUploads(prev => [...prev, ...newUploads]);
    
    // Process each file
    newUploads.forEach(upload => processFile(upload));
  }, []);

  const processFile = async (upload: UploadStatus) => {
    try {
      // Simulate file upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploads(prev => prev.map(u => 
          u.file === upload.file ? { ...u, progress } : u
        ));
      }

      // Change to processing status
      setUploads(prev => prev.map(u => 
        u.file === upload.file ? { ...u, status: 'processing' } : u
      ));

      // Simulate document processing
      const formData = new FormData();
      formData.append('file', upload.file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Mark as completed
      setUploads(prev => prev.map(u => 
        u.file === upload.file ? { ...u, status: 'completed' } : u
      ));

      // Notify parent component
      onDocumentUploaded({
        id: result.id,
        name: upload.file.name,
        type: upload.file.type,
        size: upload.file.size,
        uploadedAt: new Date().toISOString(),
        processed: true,
      });

      // Remove from uploads after 2 seconds
      setTimeout(() => {
        setUploads(prev => prev.filter(u => u.file !== upload.file));
      }, 2000);

    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.file === upload.file ? { 
          ...u, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        } : u
      ));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDF, DOCX, or TXT files to start asking questions. Maximum file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, and TXT files
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {uploads.map((upload, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {upload.status === 'completed' ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : upload.status === 'error' ? (
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      ) : (
                        <FileText className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium truncate">
                          {upload.file.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(upload.file.size)}
                        </span>
                      </div>
                      
                      {upload.status === 'error' ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{upload.error}</AlertDescription>
                        </Alert>
                      ) : upload.status === 'completed' ? (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          ✓ Processed successfully
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {upload.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                            </span>
                            {upload.status === 'uploading' && (
                              <span>{upload.progress}%</span>
                            )}
                          </div>
                          {upload.status === 'uploading' ? (
                            <Progress value={upload.progress} className="h-2" />
                          ) : (
                            <div className="h-2 bg-muted rounded-full">
                              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}