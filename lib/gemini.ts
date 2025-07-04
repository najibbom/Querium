import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function createEmbedding(text: string): Promise<number[]> {
  // Gemini's public API may not support embeddings yet.
  // If/when it does, update this function accordingly.
  throw new Error('Embedding generation is not supported with Gemini API as of now.');
}

export async function generateResponse(
  query: string,
  context: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    // Gemini uses a single prompt string, but you can simulate history/context.
    const prompt = [
      `You are a helpful AI assistant that answers questions based on the provided document context.`,
      `Always base your answers on the given context. If the context doesn't contain enough information to answer the question, say so clearly.`,
      `Be concise but comprehensive in your responses. Use markdown formatting when appropriate.`,
      ...history.slice(-5).map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`),
      `Context: ${context}`,
      `Question: ${query}`
    ].join('\n\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return text || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}