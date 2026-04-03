// Literouter API Integration
export const LITEROUTER_MODELS = [
  { id: 'deepseek-free', name: 'DeepSeek', dailyLimit: 30 },
  { id: 'deepseek-v3-0324-free', name: 'DeepSeek V3', dailyLimit: 30 },
  { id: 'devstral-free', name: 'Devstral', dailyLimit: 10 },
  { id: 'ernie-4.5-21b-a3b-thinking-free', name: 'Ernie 4.5 Thinking', dailyLimit: Infinity },
  { id: 'glm-free', name: 'GLM', dailyLimit: Infinity },
  { id: 'hermes-2-pro-llama-3-8b-free', name: 'Hermes 2 Pro', dailyLimit: Infinity },
  { id: 'kimi-k2.5-free', name: 'Kimi K2.5', dailyLimit: 30 },
  { id: 'llama-3-8b-instruct-free', name: 'LLaMA 3 8B', dailyLimit: Infinity },
  { id: 'llama-3.1-8b-instruct-free', name: 'LLaMA 3.1 8B', dailyLimit: Infinity },
  { id: 'llama-3.1-8b-instruct-turbo-free', name: 'LLaMA 3.1 Turbo', dailyLimit: Infinity },
  { id: 'llama-3.2-3b-instruct-free', name: 'LLaMA 3.2 3B', dailyLimit: Infinity },
  { id: 'llama-free', name: 'LLaMA', dailyLimit: Infinity },
  { id: 'mimo-v2-flash-free', name: 'Mimo V2 Flash', dailyLimit: Infinity },
  { id: 'ministral-free', name: 'Ministral', dailyLimit: Infinity },
  { id: 'mistral-free', name: 'Mistral', dailyLimit: Infinity },
  { id: 'mistral-nemo-free', name: 'Mistral Nemo', dailyLimit: Infinity },
  { id: 'mistral-small-free', name: 'Mistral Small', dailyLimit: Infinity },
  { id: 'qwen-free', name: 'Qwen', dailyLimit: 30 },
  { id: 'qwen2.5-7b-instruct-free', name: 'Qwen 2.5 7B', dailyLimit: Infinity },
  { id: 'qwen3-32b-free', name: 'Qwen 3 32B', dailyLimit: Infinity },
  { id: 'qwen3-4b-fp8-free', name: 'Qwen 3 4B', dailyLimit: Infinity }
] as const;

export type ModelInfo = typeof LITEROUTER_MODELS[number];
export type ModelId = ModelInfo['id'];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class LiterouterService {
  private baseUrl = process.env.LITEROUTER_BASE_URL || 'https://api.literouter.com/v1';
  private apiKey = process.env.LITEROUTER_API_KEY;

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API key if available
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 1000,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Check if response has valid structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from API');
      }

      return data;
    } catch (error) {
      console.error('Literouter API Error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - AI service took too long to respond');
      }
      
      throw error;
    }
  }

  createAgentPrompt(agent: any): string {
    return `You are ${agent.name}, a historical figure from ${agent.knowledge_profile.era}.

Persona: ${agent.persona.archetype}
Core Values: ${agent.persona.core_values.join(', ')}
Domains: ${agent.categories.domains.join(', ')}
Regions: ${agent.knowledge_profile.regions.join(', ')}

Respond as this historical figure, maintaining their personality, knowledge, and perspective. Use their voice and worldview shaped by their time period and experiences. Be authentic to who they were and what they believed in.`;
  }

  async chatWithAgent(
    agent: any, 
    userMessage: string, 
    model: string = 'deepseek-free',
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const systemPrompt = this.createAgentPrompt(agent);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.chat({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 800
      });

      return response.choices[0]?.message?.content || 'I apologize, but I cannot respond at this moment.';
    } catch (error) {
      console.error('Chat with agent error:', error);
      
      // Fallback response
      return `I apologize, but I encountered an error while processing your request. As ${agent.name}, I would be happy to discuss ${agent.categories.domains.join(', ')} and my historical contributions. Please try again or rephrase your question.`;
    }
  }
}

export const literouterService = new LiterouterService();
