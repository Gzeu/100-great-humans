import { NextRequest, NextResponse } from 'next/server';
import { pollinationsService } from '../../../lib/pollinations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, width, height, seed, nologo, enhance, private: isPrivate } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await pollinationsService.generateImage({
      prompt,
      model,
      width,
      height,
      seed,
      nologo,
      enhance,
      private: isPrivate
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Image Generation API Error:', error);
    
    let errorMessage = 'Failed to generate image';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Image generation timeout - please try again';
        statusCode = 408;
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to image service';
        statusCode = 503;
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded - please wait and try again';
        statusCode = 429;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function GET() {
  try {
    const models = await pollinationsService.getAvailableModels();
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching image models:', error);
    return NextResponse.json(
      { models: ['flux', 'turbo', 'stable-diffusion'] },
      { status: 500 }
    );
  }
}
