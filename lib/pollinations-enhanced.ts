// Pollinations.ai Enhanced Service
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
  style?: string; // New: Style control
  negative_prompt?: string; // New: Negative prompts
  num_outputs?: number; // New: Multiple outputs
  guidance_scale?: number; // New: Guidance scale
  num_inference_steps?: number; // New: Inference steps
  image_url?: string; // New: Image-to-image variation
}

export interface TextGenerationRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  system?: string;
  json?: boolean;
  context_window?: number; // New: Context window control
  reasoning?: boolean; // New: Reasoning mode
  tools?: any[]; // New: Tool use
  stream?: boolean; // New: Streaming response
}

export interface AudioGenerationRequest {
  prompt: string;
  model?: string;
  voice?: string;
  response_format?: string;
  speed?: number;
  duration?: number;
  instrumental?: boolean;
  style?: string;
  midi?: boolean; // New: MIDI generation
  format?: 'mp3' | 'wav' | 'midi'; // New: Multiple formats
}

export interface VideoGenerationRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  enhance?: boolean;
  duration?: number;
  aspectRatio?: string;
  audio?: boolean;
  imageUrl?: string; // New: Image-to-video
  fps?: number; // New: Frame rate control
  quality?: 'draft' | 'standard' | 'high'; // New: Quality levels
}

export interface GenerationResponse {
  url: string;
  type: string;
  prompt: string;
  model: string;
  success: boolean;
  error?: string;
  metadata?: any;
}

export class PollinationsEnhancedService {
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

    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': '100-Great-Humans/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  }

  // Image Generation with new models
  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      // Use image endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/image/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'flux', // Default to Flux
        width: request.width || 1024,
        height: request.height || 1024,
        seed: request.seed,
        nologo: request.nologo !== false, // Default to true
        enhance: request.enhance,
        quality: request.quality,
        style: request.style,
        negative_prompt: request.negative_prompt,
        num_outputs: request.num_outputs || 1,
        guidance_scale: request.guidance_scale,
        num_inference_steps: request.num_inference_steps,
        image_url: request.image_url, // For image-to-image
        key: this.apiKey || process.env.POLLINATIONS_API_KEY
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

  // Text Generation with new models
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse> {
    try {
      // Use free text endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/text/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'mistral',
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 500,
        top_p: request.top_p,
        system: request.system,
        json: request.json,
        context_window: request.context_window,
        reasoning: request.reasoning,
        tools: request.tools,
        stream: request.stream,
        key: this.apiKey || process.env.POLLINATIONS_API_KEY
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

  // Audio Generation with new models and MIDI
  async generateAudio(request: AudioGenerationRequest): Promise<GenerationResponse> {
    try {
      // Use audio endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/audio/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'tts-1',
        voice: request.voice,
        response_format: request.response_format || (request.midi ? 'midi' : 'mp3'),
        speed: request.speed || 1.0,
        duration: request.duration || (request.midi ? 30 : 10), // MIDI default 30s
        instrumental: request.instrumental,
        style: request.style,
        midi: request.midi,
        format: request.format,
        key: this.apiKey || process.env.POLLINATIONS_API_KEY
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

  // Video Generation with new models and image-to-video
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse> {
    try {
      // Use video endpoint with API key as query parameter
      const endpoint = `https://gen.pollinations.ai/video/${encodeURIComponent(request.prompt)}`;
      const params = {
        model: request.model || 'wan-fast',
        width: request.width || 1024,
        height: request.height || 576,
        seed: request.seed,
        enhance: request.enhance !== false,
        duration: request.duration || 5,
        aspectRatio: request.aspectRatio || '16:9',
        audio: request.audio !== false, // Default to true for supported models
        imageUrl: request.imageUrl, // For image-to-video
        fps: request.fps || 24,
        quality: request.quality || 'standard',
        key: this.apiKey || process.env.POLLINATIONS_API_KEY
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
      return this.getDefaultModels(type);
    }
  }

  private getDefaultModels(type: string): string[] {
    switch (type) {
      case 'image':
        return [
          // Free models
          'flux', 'flux-schnell', 'zimage', 'gptimage',
          // New models
          'wan-image', 'wan-image-pro', 'qwen-image-plus', 'qwen-image-edit-plus',
          // Premium models
          'flux-pro', 'dall-e-3', 'midjourney-v6'
        ];
      case 'text':
        return [
          // Free models
          'mistral', 'llama-3.1-8b', 'qwen-coder', 'claude-haiku',
          // New models
          'grok-reasoning', 'nova-pro', 'nova-canvas', 'nova-reel',
          // Premium models
          'claude-opus', 'gpt-4o', 'grok-imagine'
        ];
      case 'audio':
        return [
          // Free models
          'tts-1', 'alloy', 'nova', 'echo',
          // New models
          'ace-step-1.5-turbo', 'openai-audio-large', 'midijourney',
          // Premium models
          'eleven-multilingual-v2', 'uberduck'
        ];
      case 'video':
        return [
          // Free models
          'wan-fast', 'ltx-2', 'p-video',
          // New models
          'ltx-2.3', 'grok-video-pro', 'wan-image-pro-video',
          // Premium models
          'sora-turbo', 'pika-labs-pro'
        ];
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

  // Create contextual prompt for agent
  private createAgentPrompt(agent: any, userDescription: string, type: string): string {
    const agentName = agent.name || 'Agent';
    const agentPersona = agent.persona?.archetype || 'Historical Figure';
    const agentEra = agent.knowledge_profile?.era || 'Historical';
    
    let styleInstruction = '';
    switch (type) {
      case 'image':
        styleInstruction = 'Create a visual representation';
        break;
      case 'audio':
        styleInstruction = 'Create audio content';
        break;
      case 'video':
        styleInstruction = 'Create video content';
        break;
      case 'text':
        styleInstruction = 'Write in the authentic voice and style';
        break;
    }

    return `As ${agentName}, ${agentPersona} from ${agentEra}, known for ${agent.categories?.domains?.join(', ') || 'various achievements'}, ${userDescription}. ${styleInstruction} of ${agentName}, reflecting the historical context and your personal experiences.`;
  }

  // Generate content for agent
  async generateAgentContent(agent: any, userDescription: string, type: string, options: any = {}): Promise<GenerationResponse> {
    const contextualPrompt = this.createAgentPrompt(agent, userDescription, type);
    
    switch (type) {
      case 'image':
        return this.generateImage({
          prompt: contextualPrompt,
          model: options.model,
          width: options.width,
          height: options.height,
          seed: options.seed,
          nologo: options.nologo,
          enhance: options.enhance,
          quality: options.quality
        });
      case 'text':
        return this.generateText({
          prompt: contextualPrompt,
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
          top_p: options.top_p
        });
      case 'audio':
        return this.generateAudio({
          prompt: contextualPrompt,
          model: options.model,
          voice: options.voice,
          response_format: options.response_format,
          speed: options.speed,
          duration: options.duration
        });
      case 'video':
        return this.generateVideo({
          prompt: contextualPrompt,
          model: options.model,
          width: options.width,
          height: options.height,
          seed: options.seed,
          enhance: options.enhance,
          duration: options.duration,
          aspectRatio: options.aspectRatio,
          audio: options.audio
        });
      default:
        throw new Error(`Unsupported content type: ${type}`);
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

  // NEW: Generate seamless textures for games/backgrounds
  async generateSeamlessTexture(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const texturePrompt = `seamless repeating pattern, ${request.prompt}, tileable texture, no visible seams`;
      return this.generateImage({
        ...request,
        prompt: texturePrompt,
        model: request.model || 'flux-schnell',
        style: request.style || 'texture',
        enhance: true
      });
    } catch (error) {
      return this.handleError(error, request.prompt, 'image', request.model || 'flux-schnell');
    }
  }

  // NEW: Generate Open Graph preview cards
  async generateOpenGraphCard(request: {
    title: string;
    description?: string;
    imageUrl?: string;
    theme?: 'professional' | 'colorful' | 'minimal' | 'creative';
  }): Promise<GenerationResponse> {
    try {
      const ogPrompt = `Open Graph social media preview card for "${request.title}". ${request.description ? `Description: ${request.description}` : ''}. Style: ${request.theme || 'professional'}. 1200x630 pixels, perfect for social sharing, clean design, readable text.`;
      
      return this.generateImage({
        prompt: ogPrompt,
        width: 1200,
        height: 630,
        model: 'flux-schnell',
        nologo: true,
        enhance: true,
        style: 'graphic design'
      });
    } catch (error) {
      return this.handleError(error, request.title, 'image', 'flux-schnell');
    }
  }

  // NEW: Generate scientific visualizations
  async generateScientificVisualization(request: {
    topic: string;
    style: 'quantum' | 'molecular' | 'astronomical' | 'biological' | 'mathematical' | 'cybernetic';
    detail?: 'simple' | 'detailed' | 'complex';
  }): Promise<GenerationResponse> {
    try {
      const sciPrompt = `Scientific visualization of ${request.topic} in ${request.style} style. ${request.detail === 'complex' ? 'Highly detailed, intricate patterns, advanced scientific accuracy.' : request.detail === 'detailed' ? 'Moderately detailed with clear scientific elements.' : 'Clean, simple scientific representation.'} Educational, accurate, visually engaging.`;
      
      return this.generateImage({
        prompt: sciPrompt,
        model: 'qwen-image-plus',
        enhance: true,
        style: 'scientific visualization'
      });
    } catch (error) {
      return this.handleError(error, request.topic, 'image', 'qwen-image-plus');
    }
  }

  // NEW: Generate educational content
  async generateEducationalContent(request: {
    topic: string;
    level: 'elementary' | 'middle' | 'high' | 'university';
    format: 'explanation' | 'quiz' | 'summary' | 'examples';
    agent?: any;
  }): Promise<GenerationResponse> {
    try {
      const levelMap = {
        elementary: 'simple language, basic concepts, suitable for ages 6-10',
        middle: 'intermediate concepts, suitable for ages 11-14',
        high: 'advanced concepts, suitable for ages 15-18',
        university: 'expert level, detailed analysis, academic terminology'
      };

      const formatMap = {
        explanation: 'clear explanation with examples',
        quiz: 'interactive quiz questions with answers',
        summary: 'concise summary of key points',
        examples: 'practical examples and applications'
      };

      let eduPrompt = `Create ${formatMap[request.format]} about ${request.topic} for ${levelMap[request.level]} level.`;
      
      if (request.agent) {
        eduPrompt = this.createAgentPrompt(request.agent, eduPrompt, 'text');
      }

      return this.generateText({
        prompt: eduPrompt,
        model: 'claude-haiku',
        temperature: 0.7,
        max_tokens: 800
      });
    } catch (error) {
      return this.handleError(error, request.topic, 'text', 'claude-haiku');
    }
  }

  // NEW: Generate music with ACE-Step
  async generateMusic(request: {
    prompt: string;
    duration?: number; // 15-30 seconds for ACE-Step
    style?: string;
    tempo?: 'slow' | 'medium' | 'fast';
    instruments?: string[];
  }): Promise<GenerationResponse> {
    try {
      const musicPrompt = `${request.prompt} ${request.style ? `in ${request.style} style` : ''} ${request.tempo ? `with ${request.tempo} tempo` : ''} ${request.instruments ? `featuring ${request.instruments.join(', ')}` : ''}. Music composition, instrumental, high quality.`;
      
      return this.generateAudio({
        prompt: musicPrompt,
        model: 'ace-step-1.5-turbo',
        duration: request.duration || 20,
        instrumental: true,
        style: request.style,
        format: 'mp3'
      });
    } catch (error) {
      return this.handleError(error, request.prompt, 'audio', 'ace-step-1.5-turbo');
    }
  }

  // NEW: Generate MIDI composition
  async generateMIDI(request: {
    prompt: string;
    duration?: number;
    genre?: string;
    complexity?: 'simple' | 'moderate' | 'complex';
  }): Promise<GenerationResponse> {
    try {
      const midiPrompt = `MIDI composition: ${request.prompt} ${request.genre ? `in ${request.genre} genre` : ''} ${request.complexity ? `with ${request.complexity} complexity` : ''}. Musical notation, digital music format.`;
      
      return this.generateAudio({
        prompt: midiPrompt,
        model: 'midijourney',
        duration: request.duration || 30,
        midi: true,
        format: 'midi'
      });
    } catch (error) {
      return this.handleError(error, request.prompt, 'audio', 'midijourney');
    }
  }

  // NEW: Generate video with image-to-video
  async generateVideoFromImage(request: {
    imageUrl: string;
    prompt?: string;
    duration?: number;
    model?: string;
  }): Promise<GenerationResponse> {
    try {
      const videoPrompt = request.prompt || 'animate this image with smooth motion, cinematic quality';
      
      return this.generateVideo({
        prompt: videoPrompt,
        imageUrl: request.imageUrl,
        model: request.model || 'grok-video-pro',
        duration: request.duration || 5,
        enhance: true,
        audio: true
      });
    } catch (error) {
      return this.handleError(error, request.prompt || 'image animation', 'video', request.model || 'grok-video-pro');
    }
  }

  // NEW: Generate content with reasoning
  async generateWithReasoning(request: TextGenerationRequest): Promise<GenerationResponse> {
    try {
      return this.generateText({
        ...request,
        model: request.model || 'grok-reasoning',
        reasoning: true,
        context_window: 2000000, // 2M token context
        temperature: 0.3 // Lower temperature for more analytical responses
      });
    } catch (error) {
      return this.handleError(error, request.prompt, 'text', request.model || 'grok-reasoning');
    }
  }

  // NEW: Generate multi-modal content (text + image + audio)
  async generateMultiModal(request: {
    prompt: string;
    agent?: any;
    includeImage?: boolean;
    includeAudio?: boolean;
    includeText?: boolean;
    imageOptions?: any;
    audioOptions?: any;
    textOptions?: any;
  }): Promise<{
    image?: GenerationResponse;
    audio?: GenerationResponse;
    text?: GenerationResponse;
  }> {
    const results: any = {};
    
    try {
      if (request.includeImage !== false) {
        const imagePrompt = this.createAgentPrompt(request.agent, request.prompt, 'image');
        results.image = await this.generateImage({
          prompt: imagePrompt,
          ...(request.imageOptions || {})
        });
      }
      
      if (request.includeAudio !== false) {
        const audioPrompt = this.createAgentPrompt(request.agent, request.prompt, 'audio');
        results.audio = await this.generateAudio({
          prompt: audioPrompt,
          ...(request.audioOptions || {})
        });
      }
      
      if (request.includeText !== false) {
        const textPrompt = this.createAgentPrompt(request.agent, request.prompt, 'text');
        results.text = await this.generateText({
          prompt: textPrompt,
          ...(request.textOptions || {})
        });
      }
      
      return results;
    } catch (error) {
      console.error('Multi-modal generation error:', error);
      return results;
    }
  }
}

// Export singleton instance
export const pollinationsEnhancedService = new PollinationsEnhancedService();
