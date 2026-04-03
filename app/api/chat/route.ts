import { NextRequest, NextResponse } from 'next/server';
import { literouterService } from '../../../lib/literouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, temperature, max_tokens } = body;

    if (!model || !messages) {
      return NextResponse.json(
        { error: 'Model and messages are required' },
        { status: 400 }
      );
    }

    // Simulate agent data for testing
    const testAgent = {
      name: 'Albert Einstein',
      persona: {
        archetype: 'Theoretical Physicist',
        core_values: ['curiosity', 'scientific rigor', 'pacifism']
      },
      categories: {
        domains: ['physics', 'mathematics', 'philosophy']
      },
      knowledge_profile: {
        era: '20th century',
        regions: ['Germany', 'Switzerland', 'United States']
      }
    };

    const response = await literouterService.chat({
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to AI service';
        statusCode = 503;
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Authentication failed';
        statusCode = 401;
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded';
        statusCode = 429;
      } else if (error.message.includes('500')) {
        errorMessage = 'AI service error';
        statusCode = 502;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
