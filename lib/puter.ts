// Puter.js Image Generation Service - Free & Unlimited

export interface PuterImageRequest {
  prompt: string;
  model?: string;
  quality?: string;
  seed?: number;
  width?: number;
  height?: number;
}

export interface PuterImageResponse {
  imageUrl: string;
  prompt: string;
  model: string;
  quality: string;
  success: boolean;
  error?: string;
}

class PuterService {
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  private async loadPuter(): Promise<void> {
    if (this.isLoaded) return;
    
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      // Load Puter.js script
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Puter.js'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  async generateImage(request: PuterImageRequest): Promise<PuterImageResponse> {
    try {
      await this.loadPuter();

      if (!window.puter || !window.puter.ai) {
        throw new Error('Puter.ai not available');
      }

      const prompt = request.prompt;
      const options: any = {};

      // Set model if specified
      if (request.model) {
        options.model = request.model;
      }

      // Set quality if specified
      if (request.quality) {
        options.quality = request.quality;
      }

      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

      try {
        const imageElement = await Promise.race([
          window.puter.ai.txt2img(prompt, options),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Image generation timeout')), 120000)
          )
        ]);

        clearTimeout(timeoutId);

        if (!imageElement) {
          throw new Error('Failed to generate image');
        }

        // Convert image element to data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Set default dimensions if image doesn't have them
        const imgWidth = (imageElement as any).width || 512;
        const imgHeight = (imageElement as any).height || 512;
        
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        
        ctx.drawImage(imageElement as HTMLImageElement, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/png');

        return {
          imageUrl: dataUrl,
          prompt: request.prompt,
          model: request.model || 'gpt-image-1',
          quality: request.quality || 'low',
          success: true
        };

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }

    } catch (error) {
      console.error('Puter Image Generation Error:', error);
      
      let errorMessage = 'Failed to generate image';
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Image generation timed out';
        } else if (error.message.includes('Puter')) {
          errorMessage = 'Failed to load Puter.js service';
        }
      }

      return {
        imageUrl: '',
        prompt: request.prompt,
        model: request.model || 'gpt-image-1',
        quality: request.quality || 'low',
        success: false,
        error: errorMessage
      };
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
    options: Partial<PuterImageRequest> = {}
  ): Promise<PuterImageResponse> {
    const prompt = this.createImagePrompt(agent, userDescription);
    
    return this.generateImage({
      prompt,
      model: 'gpt-image-1.5',
      quality: 'medium',
      ...options
    });
  }

  getAvailableModels(): string[] {
    return [
      'gpt-image-1.5',
      'gpt-image-1',
      'gpt-image-1-mini',
      'dall-e-3',
      'dall-e-2',
      'gemini-2.5-flash-image-preview',
      'black-forest-labs/FLUX.1-schnell',
      'stabilityai/stable-diffusion-3-medium',
      'google/imagen-4.0-fast'
    ];
  }
}

// Add TypeScript declarations for Puter
declare global {
  interface Window {
    puter: {
      ai: {
        txt2img: (prompt: string, options?: any) => Promise<HTMLImageElement>;
      };
    };
  }
}

export const puterService = new PuterService();
