'use client';

import { useState, useRef, useEffect } from 'react';
import { literouterService, LITEROUTER_MODELS, ChatMessage, ModelInfo, ModelId } from '../lib/literouter';
import { puterService, PuterImageRequest } from '../lib/puter';

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

interface ChatInterfaceProps {
  agent: Agent;
  onClose: () => void;
}

export default function ChatInterface({ agent, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>(LITEROUTER_MODELS[0].id);
  const [imagePrompt, setImagePrompt] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    
    try {
      const response = await puterService.generateAgentImage(agent, imagePrompt);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate image');
      }
      
      const imageMessage: ChatMessage = {
        role: 'assistant',
        content: `🎨 **Generated Image**: ${imagePrompt}\n\n![${agent.name}](${response.imageUrl})`
      };
      
      setMessages([...messages, imageMessage]);
      setImagePrompt('');
      setShowImageGenerator(false);
    } catch (error) {
      console.error('Image generation error:', error);
      let errorMessage = 'Failed to generate image. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Image generation timed out. Please try again.';
        } else if (error.message.includes('Puter')) {
          errorMessage = 'Failed to load image generation service.';
        }
      }
      
      const errorImageMessage: ChatMessage = {
        role: 'assistant',
        content: errorMessage
      };
      setMessages([...messages, errorImageMessage]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
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
      
      // Check if it's a network error
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-white font-bold">{agent.name}</h3>
              <p className="text-gray-400 text-sm">{agent.persona.archetype}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImageGenerator(!showImageGenerator)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              title="Free unlimited image generation"
            >
              🎨 Generate Image (∞)
            </button>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="mb-2">Start a conversation with {agent.name}</p>
              <p className="text-sm">Ask about their life, work, or generate historical images</p>
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
                {message.content.includes('![') ? (
                  // Render markdown for images
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto mt-2" />')
                        .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
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

        {/* Image Generator Panel */}
        {showImageGenerator && (
          <div className="border-t border-white/10 p-4 bg-purple-500/5">
            <div className="space-y-3">
              <h4 className="text-white font-semibold flex items-center gap-2">
                🎨 Generate Historical Image (Free & Unlimited)
              </h4>
              <p className="text-gray-400 text-sm">
                Describe an image of {agent.name} in their historical context - no limits!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder={`e.g., writing at their desk, giving a speech, in their study`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  disabled={isGeneratingImage}
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                >
                  {isGeneratingImage ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
