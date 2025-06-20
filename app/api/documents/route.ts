import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/documents`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}