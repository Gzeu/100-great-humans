// Enhanced Pollinations.ai Service - Text, Image, Audio, Video Generation

export interface PollinationsConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface GenerationRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
  private?: boolean;
  quality?: string;
}

export interface TextGenerationRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface AudioGenerationRequest {
  prompt: string;
  model?: string;
  voice?: string;
  duration?: number;
}

export interface VideoGenerationRequest {
  prompt: string;
  model?: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
}

export interface GenerationResponse {
  url: string;
  type: 'image' | 'audio' | 'video' | 'text';
  prompt: string;
  model: string;
  success: boolean;
  error?: string;
  metadata?: any;
}

class PollinationsEnhancedService {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: PollinationsConfig = {}) {
    this.apiKey = config.apiKey || process.env.POLLINATIONS_API_KEY || '';
    this.baseUrl = config.baseUrl || process.env.POLLINATIONS_BASE_URL || 'https://gen.pollinations.ai';
  }

  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    // Handle direct gen.pollinations.ai URLs
    if (endpoint.includes('gen.pollinations.ai/image/') || endpoint.includes('gen.pollinations.ai/audio/') || endpoint.includes('gen.pollinations.ai/video/') || endpoint.includes('gen.pollinations.ai/text/')) {
      const url = new URL(endpoint);
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'prompt') {
          url.searchParams.append(key, String(value));
        }
      });

      const headers: Record<string, string> = {
        'Accept': endpoint.includes('image/') ? 'image/*' : endpoint.includes('audio/') ? 'audio/*' : endpoint.includes('video/') ? 'video/*' : 'text/plain',
        'User-Agent': '100-Great-Humans/1.0'
      };

      // Only add API key if explicitly provided in params (for paid models)
      if (params.key && this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
        console.log('🔑 Using API key for paid model');
      } else {
        console.log('🆓 Using free tier (no API key)');
      }

      console.log('🌐 Final URL:', url.toString());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        console.log('🚀 Making fetch request to:', url.toString());
        console.log('📋 Headers:', headers);
        console.log('⏱️ Timeout set to 30s');
        
        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers
        });

        clearTimeout(timeoutId);

        console.log('📊 Response status:', response.status);
        console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // For image generation, return the actual image data or blob URL
        if (endpoint.includes('gen.pollinations.ai/image/')) {
          const blob = await response.blob();
          const dataUrl = URL.createObjectURL(blob);
          console.log('✅ Image generated successfully, size:', blob.size);
          return { url: dataUrl, blob };
        }

        // For audio/video generation, return the blob URL
        if (endpoint.includes('gen.pollinations.ai/audio/') || endpoint.includes('gen.pollinations.ai/video/')) {
          const blob = await response.blob();
          const dataUrl = URL.createObjectURL(blob);
          console.log(`✅ ${endpoint.includes('audio') ? 'Audio' : 'Video'} generated successfully, size:`, blob.size);
          return { url: dataUrl, blob };
        }

        // For text generation, return the text content
        if (endpoint.includes('gen.pollinations.ai/text/')) {
          const text = await response.text();
          console.log('✅ Text generated successfully, length:', text.length);
          return { text };
        }

        // Default fallback
        return { url: url.toString() };
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        console.log('❌ Fetch error details:');
        console.log('- Error name:', error.name);
        console.log('- Error message:', error.message);
        console.log('- Error code:', error.code);
        console.log('- Is timeout:', error.message?.includes('timeout') || error.message?.includes('aborted'));
        
        if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
          throw new Error('Request timeout - Pollinations service is temporarily unavailable');
        } else if (error.message?.includes('ECONNRESET') || error.message?.includes('ECONNREFUSED')) {
          throw new Error('Unable to connect to Pollinations service - connection refused');
        } else if (error.message?.includes('ENOTFOUND')) {
          throw new Error('Unable to resolve Pollinations service - DNS error');
        } else {
          throw error;
        }
      }
    }

    // Handle API endpoint requests
    const url = new URL(endpoint, this.baseUrl);
    
    // Add API key if available
    if (this.apiKey) {
      url.searchParams.append('apikey', this.apiKey);
    }

    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, image/*, audio/*, video/*',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('image')) {
        const blob = await response.blob();
        return {
          url: URL.createObjectURL(blob),
          type: 'image',
          size: blob.size
        };
      } else if (contentType?.includes('audio')) {
        const blob = await response.blob();
        return {
          url: URL.createObjectURL(blob),
          type: 'audio',
          size: blob.size
        };
      } else if (contentType?.includes('video')) {
        const blob = await response.blob();
        return {
          url: URL.createObjectURL(blob),
          type: 'video',
          size: blob.size
        };
      }

      }

  // Image Generation
  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      // Use image endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/image/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'flux', // Flux has free tier
        width: request.width || 1024,
        height: request.height || 1024,
        seed: request.seed,
        nologo: request.nologo,
        enhance: request.enhance,
        quality: request.quality,
        key: this.apiKey || process.env.POLLINATIONS_API_KEY // Add API key as query parameter
      };

      const result = await this.makeRequest(endpoint, params);
      
      return {
        url: result.url || result,
        type: 'image',
        prompt: request.prompt,
        model: request.model || 'flux',
        success: true,
        metadata: result
      };
    } catch (error) {
      return this.handleError(error, request.prompt, 'image', request.model || 'flux');
    }
  }

  // Text Generation
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse> {
    try {
      // Use free text endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/text/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'mistral', // Use free model
        temperature: request.temperature,
        key: this.apiKey || process.env.POLLINATIONS_API_KEY // Add API key as query parameter
      };

      const result = await this.makeRequest(endpoint, params);
      
      return {
        url: result.text || result.content || result,
        type: 'text',
        prompt: request.prompt,
        model: request.model || 'mistral',
        success: true,
        metadata: result
      };
    } catch (error) {
      return this.handleError(error, request.prompt, 'text', request.model || 'mistral');
    }
  }

  // Audio Generation
  async generateAudio(request: AudioGenerationRequest): Promise<GenerationResponse> {
    try {
      // Use audio endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/audio/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'tts-1', // TTS-1 has free tier
        voice: request.voice,
        duration: request.duration,
        key: this.apiKey || process.env.POLLINATIONS_API_KEY // Add API key as query parameter
      };

      const result = await this.makeRequest(endpoint, params);
      
      return {
        url: result.url || result,
        type: 'audio',
        prompt: request.prompt,
        model: request.model || 'tts-1',
        success: true,
        metadata: result
      };
    } catch (error) {
      return this.handleError(error, request.prompt, 'audio', request.model || 'tts-1');
    }
  }

  // Video Generation
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse> {
    try {
      // Use video endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/video/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'wan-fast', // wan-fast has free tier
        width: request.width,
        height: request.height,
        duration: request.duration,
        key: this.apiKey || process.env.POLLINATIONS_API_KEY // Add API key as query parameter
      };

      const result = await this.makeRequest(endpoint, params);
      
      return {
        url: result.url || result,
        type: 'video',
        prompt: request.prompt,
        model: request.model || 'wan-fast',
        success: true,
        metadata: result
      };
    } catch (error) {
      return this.handleError(error, request.prompt, 'video', request.model || 'wan-fast');
    }
  }

  // Get Available Models
  async getAvailableModels(type: string): Promise<string[]> {
    try {
      let endpoint;
      switch (type) {
        case 'image':
          endpoint = 'https://gen.pollinations.ai/image/models';
          break;
        case 'text':
          endpoint = 'https://gen.pollinations.ai/text/models';
          break;
        case 'audio':
          endpoint = 'https://gen.pollinations.ai/audio/models';
          break;
        default:
          endpoint = 'https://gen.pollinations.ai/v1/models';
      }

      const result = await this.makeRequest(endpoint, {});
      
      if (Array.isArray(result)) {
        return result.map((model: any) => model.id || model.name || model);
      } else if (result.data && Array.isArray(result.data)) {
        return result.data.map((model: any) => model.id || model.name || model);
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to get ${type} models:`, error);
      return [];
    }
  }

  // Get available models for each type
  async getModels(type: 'image' | 'text' | 'audio' | 'video'): Promise<string[]> {
    try {
      const result = await this.makeRequest(`/models/${type}`, {});
      return result.models || result || [];
    } catch (error) {
      console.error(`Error fetching ${type} models:`, error);
      return this.getDefaultModels(type);
    }
  }

  private getDefaultModels(type: string): string[] {
    switch (type) {
      case 'image':
        return ['flux', 'zimage', 'gptimage']; // Free image models
      case 'text':
        return ['mistral', 'llama-3.1-8b', 'qwen-coder']; // Free text models
      case 'audio':
        return ['tts-1', 'alloy', 'nova']; // Free audio models
      case 'video':
        return ['wan-fast', 'ltx-2', 'p-video']; // Free video models
      default:
        return [];
    }
  }

  private handleError(error: any, prompt: string, type: string, model: string): GenerationResponse {
    console.error(`Pollinations ${type} generation error:`, error);
    console.error(`Error details:`, {
      message: error.message,
      stack: error.stack,
      prompt: prompt.substring(0, 50) + '...',
      type,
      model
    });
    
    let errorMessage = `Failed to generate ${type}`;
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('522')) {
        errorMessage = 'Pollinations service is temporarily unavailable due to high demand. Please try again later.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Authentication failed - check API key configuration';
      } else if (error.message.includes('402') || error.message.includes('Insufficient balance')) {
        errorMessage = 'Insufficient pollen balance. Please add funds to your Pollinations account at enter.pollinations.ai';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded - please wait a moment and try again';
      } else if (error.message.includes('500')) {
        errorMessage = 'Service error - please try again later';
      } else if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to Pollinations service. Please check your internet connection and try again.';
      } else if (error.message.includes('content_filter')) {
        errorMessage = 'Content filtered by AI provider. Please modify your prompt and try again.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      url: '',
      type: type as any,
      prompt,
      model,
      success: false,
      error: errorMessage
    };
  }

  // Enhanced prompt creation for agents
  createAgentPrompt(agent: any, userDescription: string, type: 'image' | 'audio' | 'video' | 'text'): string {
    const era = agent.knowledge_profile.era;
    const archetype = agent.persona.archetype;
    const domains = agent.categories.domains.slice(0, 2).join(', ');
    
    switch (type) {
      case 'image':
        return `Historical portrait of ${agent.name}, ${archetype} from ${era}. ${userDescription}. Style: realistic historical painting, artistic, detailed, capturing the essence of ${domains}. Historical accuracy, authentic clothing and setting from ${era}.`;
      
      case 'audio':
        return `${agent.name}, ${archetype} from ${era}, speaking about ${domains}. ${userDescription}. Voice should reflect the time period and personality - authentic, articulate, with appropriate accent and tone for ${era}.`;
      
      case 'video':
        return `Historical video scene of ${agent.name}, ${archetype} from ${era}. ${userDescription}. Style: documentary-style, historically accurate setting, authentic costumes and props from ${era}. Cinematic quality showing ${domains} in action.`;
      
      case 'text':
        return `As ${agent.name}, ${archetype} from ${era}, known for ${domains}, ${userDescription}. Write in the authentic voice and style of ${era}, reflecting the historical context and your personal experiences.`;
      
      default:
        return userDescription;
    }
  }

  // Multi-modal generation for agents
  async generateAgentContent(
    agent: any, 
    userDescription: string, 
    type: 'image' | 'audio' | 'video' | 'text',
    options: any = {}
  ): Promise<GenerationResponse> {
    const prompt = this.createAgentPrompt(agent, userDescription, type);
    
    switch (type) {
      case 'image':
        return this.generateImage({ prompt, ...options });
      case 'audio':
        return this.generateAudio({ prompt, ...options });
      case 'video':
        return this.generateVideo({ prompt, ...options });
      case 'text':
        return this.generateText({ prompt, ...options });
      default:
        throw new Error(`Unsupported generation type: ${type}`);
    }
  }
}

export const pollinationsEnhancedService = new PollinationsEnhancedService();
