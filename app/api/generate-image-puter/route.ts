import { NextRequest, NextResponse } from 'next/server';

// This route is for server-side info only
// Actual image generation happens client-side with Puter.js

export async function GET() {
  return NextResponse.json({
    message: 'Puter.js image generation is client-side only',
    models: [
      'gpt-image-1.5',
      'gpt-image-1',
      'gpt-image-1-mini',
      'dall-e-3',
      'dall-e-2',
      'gemini-2.5-flash-image-preview',
      'black-forest-labs/FLUX.1-schnell',
      'stabilityai/stable-diffusion-3-medium',
      'google/imagen-4.0-fast'
    ],
    instructions: 'Use puterService.generateImage() in client-side code'
  });
}
