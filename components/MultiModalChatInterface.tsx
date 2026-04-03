'use client';

import { useState, useRef, useEffect } from 'react';
import { literouterService, LITEROUTER_MODELS, ChatMessage, ModelInfo, ModelId } from '../lib/literouter';
import { pollinationsEnhancedService } from '../lib/pollinations-enhanced';

interface Agent {
  id: string;
  name: string;
  rank: number;
  categories: {
    domains: string[];
    subdomains: string[];
    impact_tags: string[];
  };
  persona: {
    archetype: string;
    core_values: string[];
  };
  knowledge_profile: {
    era: string;
    regions: string[];
  };
}

interface MultiModalChatInterfaceProps {
  agent: Agent;
  onClose: () => void;
}

type GenerationType = 'text' | 'image' | 'audio' | 'video';

export default function MultiModalChatInterface({ agent, onClose }: MultiModalChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setIsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>(LITEROUTER_MODELS[0].id);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableModels, setAvailableModels] = useState<Record<string, string[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load available models for each type
    const loadModels = async () => {
      const types: GenerationType[] = ['image', 'audio', 'video', 'text'];
      const models: Record<string, string[]> = {};
      
      for (const type of types) {
        try {
          const response = await fetch(`/api/pollinations/generate?type=${type}`);
          const data = await response.json();
          models[type] = data.models || [];
        } catch (error) {
          models[type] = [];
        }
      }
      
      setAvailableModels(models);
    };

    loadModels();
  }, []);

  const handleGenerateContent = async () => {
    if (!generationPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    
    try {
      let content = '';
      
      // Use Pollinations for all content types
      const response = await fetch('/api/pollinations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: generationType,
          prompt: generationPrompt,
          agent: agent,
          model: availableModels[generationType]?.[0]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          switch (generationType) {
            case 'image':
              content = `🎨 **Generated Image**: ${generationPrompt}\n\n![${agent.name}](${data.url})`;
              break;
            case 'audio':
              content = `🎵 **Generated Audio**: ${generationPrompt}\n\n<audio controls style="width: 100%; margin-top: 10px;"><source src="${data.url}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
              break;
            case 'video':
              content = `🎬 **Generated Video**: ${generationPrompt}\n\n<video controls style="width: 100%; max-width: 400px; margin-top: 10px; border-radius: 8px;"><source src="${data.url}" type="video/mp4">Your browser does not support the video element.</video>`;
              break;
            case 'text':
              content = `📝 **Generated Text**: ${generationPrompt}\n\n${data.url}`;
              break;
          }
        } else {
          throw new Error(data.error?.message || 'Pollinations failed');
        }
      } else {
        const errorText = await response.text();
        let errorMessage = `Pollinations API error: ${response.status}`;
        
        // Try to parse Pollinations error format
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            switch (errorData.error.code) {
              case 'UNAUTHORIZED':
                errorMessage = 'API key invalid or expired';
                break;
              case 'PAYMENT_REQUIRED':
                errorMessage = 'Insufficient pollen balance';
                break;
              case 'FORBIDDEN':
                errorMessage = 'API key lacks required permissions';
                break;
              case 'RATE_LIMITED':
                errorMessage = 'Rate limit exceeded. Please wait and try again';
                break;
              default:
                errorMessage = errorData.error.message || 'Unknown error';
            }
          }
        } catch {
          errorMessage = `HTTP ${response.status}: ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const contentMessage: ChatMessage = {
        role: 'assistant',
        content
      };
      
      setMessages([...messages, contentMessage]);
      setGenerationPrompt('');
      setShowGenerator(false);
    } catch (error) {
      console.error('Content generation error:', error);
      let errorMessage = `Failed to generate ${generationType}.`;
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('522')) {
          errorMessage = 'Pollinations service is temporarily unavailable due to high demand. Please try again later.';
        } else if (error.message.includes('rate limit') || error.message.includes('429')) {
          errorMessage = 'Service temporarily busy. Please wait a moment and try again.';
        } else if (error.message.includes('balance') || error.message.includes('402')) {
          errorMessage = 'Insufficient pollen balance. Please check your Pollinations account.';
        } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
          errorMessage = 'API key authentication failed. Please check Pollinations configuration.';
        } else if (error.message.includes('forbidden') || error.message.includes('403')) {
          errorMessage = 'API key lacks required permissions for this content type.';
        } else if (error.message.includes('service unavailable')) {
          errorMessage = 'Pollinations service is currently down. Please try again later.';
        } else {
          errorMessage = 'Unable to connect to Pollinations service. Please try again.';
        }
        
        errorMessage += ' (Powered by Pollinations.ai)';
      }
      
      const errorMessageChat: ChatMessage = {
        role: 'assistant',
        content: errorMessage
      };
      setMessages([...messages, errorMessageChat]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: literouterService.createAgentPrompt(agent)
            },
            ...messages,
            { role: 'user', content: input }
          ],
          temperature: 0.8,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from API');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = 'I apologize, but I encountered an error while processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('timeout')) {
          errorMessage = 'Network error: Unable to connect to the AI service. Please check your internet connection and try again.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'Authentication error: There seems to be an issue with the API configuration. Please contact support.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded: The AI service is temporarily busy. Please wait a moment and try again.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Service error: The AI service is experiencing issues. Please try again in a few moments.';
        } else if (error.message.includes('Invalid response structure')) {
          errorMessage = 'The AI service returned an invalid response. Please try a different model or contact support.';
        }
      }
      
      const errorChatMessage: ChatMessage = {
        role: 'assistant',
        content: errorMessage
      };
      setMessages([...newMessages, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGenerationIcon = (type: GenerationType) => {
    switch (type) {
      case 'image': return '🎨';
      case 'audio': return '🎵';
      case 'video': return '🎬';
      case 'text': return '📝';
      default: return '✨';
    }
  };

  const getGenerationPlaceholder = (type: GenerationType) => {
    switch (type) {
      case 'image': return `e.g., ${agent.name} writing at their desk, giving a speech, in their study`;
      case 'audio': return `e.g., ${agent.name} explaining their most important discovery`;
      case 'video': return `e.g., ${agent.name} working in their laboratory, teaching students`;
      case 'text': return `e.g., ${agent.name}'s thoughts on modern technology`;
      default: return `Describe what you want to generate...`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[700px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{agent.name}</h3>
              <p className="text-gray-400 text-sm">{agent.persona.archetype}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showGenerator 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ✨ Multi-Modal Generator (Pollinations.ai)
            </button>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {LITEROUTER_MODELS.map(model => (
                <option key={model.id} value={model.id} className="bg-slate-800">
                  {model.name} {model.dailyLimit === Infinity ? '(∞)' : `(${model.dailyLimit})`}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Multi-Modal Generator Panel */}
        {showGenerator && (
          <div className="border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-semibold">✨ Multi-Modal Content Generator (Pollinations.ai)</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Powered by Pollinations.ai</span>
              </div>
              
              {/* Type Selection */}
              <div className="flex gap-2 flex-wrap">
                {(['image', 'audio', 'video', 'text'] as GenerationType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setGenerationType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      generationType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {getGenerationIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Generation Input */}
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  Generate {generationType} of {agent.name} in their historical context - powered by Pollinations.ai
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    placeholder={getGenerationPlaceholder(generationType)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !generationPrompt.trim()}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        {getGenerationIcon(generationType)} Generate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Available Models */}
              {availableModels[generationType] && availableModels[generationType].length > 0 && (
                <div className="text-xs text-gray-400">
                  Available models: {availableModels[generationType].slice(0, 3).join(', ')}
                  {availableModels[generationType].length > 3 && ` +${availableModels[generationType].length - 3} more`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl mb-3">
                  {agent.name.charAt(0)}
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">Start a conversation with {agent.name} or generate content with Pollinations.ai</h4>
                <p className="text-sm">Ask about their life, work, or use the multi-modal generator for images, audio, video, and text</p>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="bg-white/10 px-3 py-1 rounded-full">💬 Chat</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full">🎨 Images</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full">🎵 Audio</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full">🎬 Video</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full">📝 Text</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Pollinations.ai</span>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {message.content.includes('![') || message.content.includes('<audio') || message.content.includes('<video') ? (
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto mt-2" />')
                        .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
                        .replace(/<audio/g, '<audio controls')
                        .replace(/<video/g, '<video controls')
                    }}
                  />
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setIsInput(e.target.value)}
              placeholder={`Ask ${agent.name} about...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
