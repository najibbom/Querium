import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Document = {
  id: string;
  name: string;
  content: string;
  embedding: number[];
  metadata: {
    type: string;
    size: number;
    uploadedAt: string;
    userId?: string;
  };
};

export async function storeDocument(document: Omit<Document, 'id'>) {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store document: ${error.message}`);
  }

  return data;
}

export async function searchDocuments(query: string, embedding: number[], limit = 5) {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
  });

  if (error) {
    throw new Error(`Failed to search documents: ${error.message}`);
  }

  return data;
}

export async function getDocumentById(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to get document: ${error.message}`);
  }

  return data;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }
}