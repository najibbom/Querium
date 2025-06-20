import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw new Error('Failed to create embedding');
  }
}

export async function generateResponse(
  query: string,
  context: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const messages = [
      {
        role: 'system' as const,
        content: `You are a helpful AI assistant that answers questions based on the provided document context. 
        Always base your answers on the given context. If the context doesn't contain enough information to answer the question, 
        say so clearly. Be concise but comprehensive in your responses. Use markdown formatting when appropriate.`,
      },
      ...history.slice(-5).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
      {
        role: 'user' as const,
        content: `Context: ${context}\n\nQuestion: ${query}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}