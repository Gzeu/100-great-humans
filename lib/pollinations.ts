// Pollinations.ai Image Generation Service

export interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
  private?: boolean;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
}

class PollinationsService {
  private baseUrl = 'https://image.pollinations.ai/prompt';

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const encodedPrompt = encodeURIComponent(request.prompt);
      const params = new URLSearchParams();

      // Add optional parameters
      if (request.model) params.append('model', request.model);
      if (request.width) params.append('width', request.width.toString());
      if (request.height) params.append('height', request.height.toString());
      if (request.seed) params.append('seed', request.seed.toString());
      if (request.nologo) params.append('nologo', request.nologo.toString());
      if (request.enhance) params.append('enhance', request.enhance.toString());
      if (request.private) params.append('private', request.private.toString());

      const url = `${this.baseUrl}/${encodedPrompt}${params.toString() ? '?' + params.toString() : ''}`;
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout for images

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Generate a unique seed if not provided
      const seed = request.seed || Math.floor(Math.random() * 1000000);

      return {
        imageUrl: url,
        prompt: request.prompt,
        model: request.model || 'flux',
        width: request.width || 1024,
        height: request.height || 1024,
        seed
      };
    } catch (error) {
      console.error('Pollinations API Error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Image generation timeout - request took too long');
      }
      
      throw error;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch('https://image.pollinations.ai/models');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      // Return default models if API fails
      return ['flux', 'turbo', 'stable-diffusion'];
    }
  }

  createImagePrompt(agent: any, userDescription: string): string {
    const era = agent.knowledge_profile.era;
    const archetype = agent.persona.archetype;
    const domains = agent.categories.domains.slice(0, 2).join(', ');
    
    // Create a historically contextual prompt
    const prompt = `Historical portrait of ${agent.name}, ${archetype} from ${era}. 
    ${userDescription}. 
    Style: realistic historical painting, artistic, detailed, capturing the essence of ${domains}. 
    Historical accuracy, authentic clothing and setting from ${era}.`;

    return prompt.replace(/\s+/g, ' ').trim();
  }

  async generateAgentImage(
    agent: any, 
    userDescription: string = '',
    options: Partial<ImageGenerationRequest> = {}
  ): Promise<ImageGenerationResponse> {
    const prompt = this.createImagePrompt(agent, userDescription);
    
    return this.generateImage({
      prompt,
      model: 'flux',
      width: 1024,
      height: 1024,
      nologo: true,
      enhance: true,
      ...options
    });
  }
}

export const pollinationsService = new PollinationsService();
