import { NextRequest, NextResponse } from 'next/server';
import { pollinationsEnhancedService } from '../../../../lib/pollinations-enhanced';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Route: Received request');
    
    const body = await request.json();
    console.log('📋 Request body:', body);
    
    const { type, prompt, agent, model, ...options } = body;

    if (!type || !prompt) {
      console.log('❌ Missing type or prompt');
      return NextResponse.json(
        { error: 'Type and prompt are required' },
        { status: 400 }
      );
    }

    // Support new generation types
    const validTypes = ['image', 'audio', 'video', 'text', 'texture', 'og-card', 'scientific', 'educational', 'music', 'midi', 'video-from-image', 'reasoning', 'multimodal'];
    
    if (!validTypes.includes(type)) {
      console.log('❌ Invalid type:', type);
      return NextResponse.json(
        { error: `Type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`🚀 Generating ${type} with prompt: "${prompt.substring(0, 50)}..."`);
    console.log('🤖 Agent data:', agent);

    let result;
    
    // Handle new generation types
    switch (type) {
      case 'texture':
        result = await pollinationsEnhancedService.generateSeamlessTexture({
          prompt,
          model,
          ...options
        });
        break;
        
      case 'og-card':
        result = await pollinationsEnhancedService.generateOpenGraphCard({
          title: prompt,
          ...options
        });
        break;
        
      case 'scientific':
        result = await pollinationsEnhancedService.generateScientificVisualization({
          topic: prompt,
          ...options
        });
        break;
        
      case 'educational':
        result = await pollinationsEnhancedService.generateEducationalContent({
          topic: prompt,
          agent,
          ...options
        });
        break;
        
      case 'music':
        result = await pollinationsEnhancedService.generateMusic({
          prompt,
          ...options
        });
        break;
        
      case 'midi':
        result = await pollinationsEnhancedService.generateMIDI({
          prompt,
          ...options
        });
        break;
        
      case 'video-from-image':
        result = await pollinationsEnhancedService.generateVideoFromImage({
          imageUrl: prompt, // Use prompt as imageUrl for this type
          ...options
        });
        break;
        
      case 'reasoning':
        result = await pollinationsEnhancedService.generateWithReasoning({
          prompt,
          model,
          ...options
        });
        break;
        
      case 'multimodal':
        result = await pollinationsEnhancedService.generateMultiModal({
          prompt,
          agent,
          ...options
        });
        break;
        
      default:
        // Use existing agent content generation
        result = await pollinationsEnhancedService.generateAgentContent(
          agent || { 
            name: 'Agent', 
            persona: { archetype: 'Historical Figure' }, 
            categories: { domains: [] }, 
            knowledge_profile: { era: 'Historical' } 
          },
          prompt,
          type,
          { model, ...options }
        );
    }

    console.log('✅ Generation result:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Pollinations generation error:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      constructor: error?.constructor?.name,
      toString: error?.toString?.()
    });
    
    let errorMessage = 'Failed to generate content';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.log('⏰ Generation timeout');
        errorMessage = 'Generation timeout - please try again';
        statusCode = 408;
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to Pollinations service';
        statusCode = 503;
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Authentication failed - check API key';
        statusCode = 401;
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'image' | 'audio' | 'video' | 'text';
  const feature = searchParams.get('feature');

  if (feature === 'new') {
    // Return new features and capabilities
    return NextResponse.json({
      features: [
        {
          id: 'texture',
          name: 'Seamless Textures',
          description: 'Generate repeating textures for games and backgrounds',
          type: 'image'
        },
        {
          id: 'og-card',
          name: 'Open Graph Cards',
          description: 'Generate social media preview cards',
          type: 'image'
        },
        {
          id: 'scientific',
          name: 'Scientific Visualizations',
          description: 'Create scientific diagrams in various styles',
          type: 'image'
        },
        {
          id: 'educational',
          name: 'Educational Content',
          description: 'Generate educational materials for different levels',
          type: 'text'
        },
        {
          id: 'music',
          name: 'Music Generation',
          description: 'Create music with ACE-Step Turbo',
          type: 'audio'
        },
        {
          id: 'midi',
          name: 'MIDI Composition',
          description: 'Generate MIDI music files',
          type: 'audio'
        },
        {
          id: 'video-from-image',
          name: 'Image-to-Video',
          description: 'Animate images with Grok Video Pro',
          type: 'video'
        },
        {
          id: 'reasoning',
          name: 'Advanced Reasoning',
          description: 'Use Grok Reasoning with 2M context',
          type: 'text'
        },
        {
          id: 'multimodal',
          name: 'Multi-Modal Generation',
          description: 'Generate text, image, and audio simultaneously',
          type: 'combined'
        }
      ],
      newModels: {
        image: ['wan-image', 'wan-image-pro', 'qwen-image-plus', 'qwen-image-edit-plus'],
        text: ['grok-reasoning', 'nova-pro', 'nova-canvas', 'nova-reel'],
        audio: ['ace-step-1.5-turbo', 'openai-audio-large', 'midijourney'],
        video: ['ltx-2.3', 'grok-video-pro', 'wan-image-pro-video']
      }
    });
  }

  if (!type || !['image', 'audio', 'video', 'text'].includes(type)) {
    return NextResponse.json(
      { error: 'Type parameter is required and must be one of: image, audio, video, text' },
      { status: 400 }
    );
  }

  try {
    const models = await pollinationsEnhancedService.getModels(type);
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { models: [] },
      { status: 500 }
    );
  }
}
