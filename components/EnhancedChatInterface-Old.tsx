'use client';

import { useState, useRef, useEffect } from 'react';
import { literouterService, LITEROUTER_MODELS, ChatMessage, ModelInfo, ModelId } from '../lib/literouter';
import { pollinationsEnhancedService } from '../lib/pollinations-enhanced';

// Enhanced Agent interface with more characters
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

// Extended character list
const CHARACTERS = [
  { id: 'aristotle', name: 'Aristotle', era: 'Ancient Greece', archetype: 'Philosopher' },
  { id: 'davinci', name: 'Leonardo da Vinci', era: 'Renaissance', archetype: 'Artist/Inventor' },
  { id: 'einstein', name: 'Albert Einstein', era: 'Modern', archetype: 'Physicist' },
  { id: 'shakespeare', name: 'William Shakespeare', era: 'Elizabethan', archetype: 'Playwright' },
  { id: 'curie', name: 'Marie Curie', era: 'Modern', archetype: 'Scientist' },
  { id: 'picasso', name: 'Pablo Picasso', era: 'Modern', archetype: 'Artist' },
  { id: 'newton', name: 'Isaac Newton', era: 'Enlightenment', archetype: 'Physicist' },
  { id: 'gandhi', name: 'Mahatma Gandhi', era: 'Modern', archetype: 'Leader' },
  { id: 'franklin', name: 'Benjamin Franklin', era: 'Enlightenment', archetype: 'Statesman/Inventor' },
  { id: 'turing', name: 'Alan Turing', era: 'Modern', archetype: 'Computer Scientist' }
];

export default function EnhancedChatInterface({ agent, onClose }: MultiModalChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>(LITEROUTER_MODELS[0].id);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableModels, setAvailableModels] = useState<Record<string, string[]>>({});
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS[0]);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadAvailableModels();
  }, []);

  const loadAvailableModels = async () => {
    try {
      const models: Record<string, string[]> = {};
      for (const type of ['image', 'text', 'audio', 'video']) {
        models[type] = await pollinationsEnhancedService.getAvailableModels(type);
      }
      setAvailableModels(models);
    } catch (error) {
      console.error('Failed to load models:', error);
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
      case 'image': return `Describe an image of ${selectedCharacter.name}...`;
      case 'audio': return `Describe audio content for ${selectedCharacter.name}...`;
      case 'video': return `Describe a video scene with ${selectedCharacter.name}...`;
      case 'text': return `What would ${selectedCharacter.name} say about...`;
      default: return 'Enter your prompt...';
    }
  };

  const handleGenerateContent = async () => {
    if (!generationPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/pollinations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: generationType,
          prompt: generationPrompt,
          agent: selectedCharacter,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        let content = '';

        if (data.success) {
          switch (generationType) {
            case 'image':
              content = `🎨 **Generated Image**: ${generationPrompt}\n\n![${selectedCharacter.name}](${data.url})`;
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
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentMessage: ChatMessage = {
        role: 'assistant',
        content: content
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
    setInput('');
    setIsLoading(true);

    try {
      const response = await literouterService.chat({
        model: selectedModel,
        messages: newMessages,
        temperature: 0.7,
        max_tokens: 1000
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'I apologize, but I cannot respond at this moment.'
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterChange = (character: typeof CHARACTERS[0]) => {
    setSelectedCharacter(character);
    setShowCharacterSelector(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-purple-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Enhanced Multi-Modal Chat</h2>
                <p className="text-sm opacity-90">Chat with historical characters & generate content</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Character Selector */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">🎭 Character:</span>
              <button
                onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                {selectedCharacter.name} ▼
              </button>
            </div>
            <div className="text-xs text-gray-400">
              {selectedCharacter.era} • {selectedCharacter.archetype}
            </div>
          </div>

          {showCharacterSelector && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-3">
              {CHARACTERS.map(character => (
                <button
                  key={character.id}
                  onClick={() => handleCharacterChange(character)}
                  className={`p-2 rounded-lg text-xs transition-all ${
                    selectedCharacter.id === character.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">{character.name}</div>
                  <div className="text-xs opacity-75">{character.archetype}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Thinking as {selectedCharacter.name}...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Chat with ${selectedCharacter.name}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              disabled={isLoading}
            />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {LITEROUTER_MODELS.map(model => (
                <option key={model.id} value={model.id} className="bg-slate-800">
                  {model.name} {model.dailyLimit === Infinity ? '(∞)' : `(${model.dailyLimit})`}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Multi-Modal Generator */}
        <div className="border-t border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showGenerator 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✨ Content Generator (Pollinations.ai)
              </button>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Powered by Pollinations.ai</span>
            </div>
          </div>

          {showGenerator && (
            <div className="space-y-4">
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
                  Generate {generationType} of {selectedCharacter.name} in their historical context - powered by Pollinations.ai
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
          )}
        </div>
      </div>
    </div>
  );
}
