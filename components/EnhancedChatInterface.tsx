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

type GenerationType = 'text' | 'image' | 'audio' | 'video' | 'texture' | 'og-card' | 'scientific' | 'educational' | 'music' | 'midi' | 'video-from-image' | 'reasoning' | 'multimodal';

// Extended character list with all historical figures
const CHARACTERS = [
  { id: 'muhammad', name: 'Muhammad', era: '6th–7th century CE', archetype: 'Prophet' },
  { id: 'isaac-newton', name: 'Isaac Newton', era: '17th–18th century CE', archetype: 'Physicist' },
  { id: 'jesus', name: 'Jesus of Nazareth', era: '1st century CE', archetype: 'Religious Leader' },
  { id: 'buddha', name: 'Gautama Buddha', era: '6th–5th century BCE', archetype: 'Spiritual Leader' },
  { id: 'cai-lun', name: 'Cai Lun', era: '1st–2nd century CE', archetype: 'Inventor' },
  { id: 'gutenberg', name: 'Johannes Gutenberg', era: '15th century CE', archetype: 'Inventor' },
  { id: 'columbus', name: 'Christopher Columbus', era: '15th–16th century CE', archetype: 'Explorer' },
  { id: 'einstein', name: 'Albert Einstein', era: '19th–20th century CE', archetype: 'Physicist' },
  { id: 'pasteur', name: 'Louis Pasteur', era: '19th century CE', archetype: 'Scientist' },
  { id: 'galileo', name: 'Galileo Galilei', era: '16th–17th century CE', archetype: 'Astronomer' },
  { id: 'aristotle', name: 'Aristotle', era: 'Classical Antiquity', archetype: 'Philosopher' },
  { id: 'euclid', name: 'Euclid of Alexandria', era: 'Hellenistic period', archetype: 'Mathematician' },
  { id: 'moses', name: 'Moses', era: 'Late Bronze Age', archetype: 'Prophet' },
  { id: 'darwin', name: 'Charles Darwin', era: '19th century CE', archetype: 'Naturalist' },
  { id: 'qin-shi-huang', name: 'Qin Shi Huang', era: '3rd century BCE', archetype: 'Emperor' },
  { id: 'augustus', name: 'Augustus', era: '1st century BCE–1st century CE', archetype: 'Emperor' },
  { id: 'copernicus', name: 'Nicolaus Copernicus', era: '15th–16th century CE', archetype: 'Astronomer' },
  { id: 'lavoisier', name: 'Antoine Lavoisier', era: '18th century CE', archetype: 'Chemist' },
  { id: 'constantine', name: 'Constantine the Great', era: '4th century CE', archetype: 'Emperor' },
  { id: 'watt', name: 'James Watt', era: '18th–19th century CE', archetype: 'Inventor' },
  { id: 'faraday', name: 'Michael Faraday', era: '19th century CE', archetype: 'Physicist' },
  { id: 'maxwell', name: 'James Clerk Maxwell', era: '19th century CE', archetype: 'Physicist' },
  { id: 'luther', name: 'Martin Luther', era: '16th century CE', archetype: 'Reformer' },
  { id: 'washington', name: 'George Washington', era: '18th century CE', archetype: 'Statesman' },
  { id: 'marx', name: 'Karl Marx', era: '19th century CE', archetype: 'Philosopher' },
  { id: 'wright-brothers', name: 'Orville and Wilbur Wright', era: '19th–20th century CE', archetype: 'Inventors' },
  { id: 'genghis-khan', name: 'Genghis Khan', era: '12th–13th century CE', archetype: 'Conqueror' },
  { id: 'adam-smith', name: 'Adam Smith', era: '18th century CE', archetype: 'Economist' },
  { id: 'shakespeare', name: 'William Shakespeare', era: 'Elizabethan and Jacobean era', archetype: 'Playwright' },
  { id: 'dalton', name: 'John Dalton', era: '18th–19th century CE', archetype: 'Chemist' },
  { id: 'alexander-great', name: 'Alexander the Great', era: '4th century BCE', archetype: 'Conqueror' },
  { id: 'napoleon', name: 'Napoleon Bonaparte', era: 'late 18th–early 19th century CE', archetype: 'Emperor' },
  { id: 'edison', name: 'Thomas Edison', era: '19th–20th century CE', archetype: 'Inventor' },
  { id: 'leeuwenhoek', name: 'Antonie van Leeuwenhoek', era: '17th–18th century CE', archetype: 'Microscopist' },
  { id: 'mortan', name: 'William T. G. Morton', era: '19th century CE', archetype: 'Physician' },
  { id: 'marconi', name: 'Guglielmo Marconi', era: '19th–20th century CE', archetype: 'Inventor' },
  { id: 'hitler', name: 'Adolf Hitler', era: '20th century CE', archetype: 'Dictator' },
  { id: 'plato', name: 'Plato', era: 'Classical Antiquity', archetype: 'Philosopher' },
  { id: 'cromwell', name: 'Oliver Cromwell', era: '17th century CE', archetype: 'Statesman' },
  { id: 'bell', name: 'Alexander Graham Bell', era: '19th–20th century CE', archetype: 'Inventor' },
  { id: 'fleming', name: 'Alexander Fleming', era: '19th–20th century CE', archetype: 'Scientist' },
  { id: 'locke', name: 'John Locke', era: '17th century CE', archetype: 'Philosopher' },
  { id: 'beethoven', name: 'Ludwig van Beethoven', era: 'Classical–Romantic transition', archetype: 'Composer' },
  { id: 'heisenberg', name: 'Werner Heisenberg', era: '20th century CE', archetype: 'Physicist' },
  { id: 'daguerre', name: 'Louis Daguerre', era: '18th–19th century CE', archetype: 'Inventor' },
  { id: 'bolivar', name: 'Simón Bolívar', era: 'late 18th–early 19th century CE', archetype: 'Liberator' },
  { id: 'descartes', name: 'René Descartes', era: '17th century CE', archetype: 'Philosopher' },
  { id: 'michelangelo', name: 'Michelangelo Buonarroti', era: 'High Renaissance', archetype: 'Artist' },
  { id: 'urban-ii', name: 'Pope Urban II', era: '11th century CE', archetype: 'Religious Leader' },
  { id: 'umar', name: 'Umar ibn al-Khattab', era: '6th–7th century CE', archetype: 'Caliph' },
  { id: 'ashoka', name: 'Ashoka', era: '3rd century BCE', archetype: 'Emperor' },
  { id: 'augustine', name: 'Augustine of Hippo', era: 'Late Antiquity', archetype: 'Theologian' },
  { id: 'harvey', name: 'William Harvey', era: '16th–17th century CE', archetype: 'Physician' },
  { id: 'rutherford', name: 'Ernest Rutherford', era: '19th–20th century CE', archetype: 'Physicist' },
  { id: 'calvin', name: 'John Calvin', era: '16th century CE', archetype: 'Reformer' },
  { id: 'mendel', name: 'Gregor Mendel', era: '19th century CE', archetype: 'Geneticist' },
  { id: 'planck', name: 'Max Planck', era: '19th–20th century CE', archetype: 'Physicist' },
  { id: 'lister', name: 'Joseph Lister', era: '19th–20th century CE', archetype: 'Physician' },
  { id: 'otto', name: 'Nikolaus Otto', era: '19th century CE', archetype: 'Inventor' },
  { id: 'pizarro', name: 'Francisco Pizarro', era: '15th–16th century CE', archetype: 'Conquistador' },
  { id: 'cortes', name: 'Hernán Cortés', era: '15th–16th century CE', archetype: 'Conquistador' },
  { id: 'jefferson', name: 'Thomas Jefferson', era: '18th–19th century CE', archetype: 'Statesman' },
  { id: 'isabella', name: 'Isabella I of Castile', era: '15th–16th century CE', archetype: 'Queen' },
  { id: 'stalin', name: 'Joseph Stalin', era: '20th century CE', archetype: 'Dictator' },
  { id: 'julius-caesar', name: 'Julius Caesar', era: '1st century BCE', archetype: 'General' },
  { id: 'william-conqueror', name: 'William the Conqueror', era: '11th century CE', archetype: 'King' },
  { id: 'freud', name: 'Sigmund Freud', era: '19th–20th century CE', archetype: 'Psychologist' },
  { id: 'jenner', name: 'Edward Jenner', era: '18th–19th century CE', archetype: 'Physician' },
  { id: 'roentgen', name: 'Wilhelm Conrad Röntgen', era: '19th–20th century CE', archetype: 'Physicist' },
  { id: 'bach', name: 'Johann Sebastian Bach', era: 'Baroque', archetype: 'Composer' },
  { id: 'laozi', name: 'Laozi', era: 'Classical Chinese antiquity', archetype: 'Philosopher' },
  { id: 'voltaire', name: 'Voltaire', era: 'Enlightenment', archetype: 'Philosopher' },
  { id: 'kepler', name: 'Johannes Kepler', era: 'Scientific Revolution', archetype: 'Astronomer' },
  { id: 'fermi', name: 'Enrico Fermi', era: '20th century CE', archetype: 'Physicist' },
  { id: 'euler', name: 'Leonhard Euler', era: '18th century CE', archetype: 'Mathematician' },
  { id: 'rousseau', name: 'Jean-Jacques Rousseau', era: 'Enlightenment', archetype: 'Philosopher' },
  { id: 'machiavelli', name: 'Niccolò Machiavelli', era: 'Renaissance', archetype: 'Philosopher' },
  { id: 'malthus', name: 'Thomas Robert Malthus', era: '18th–19th century CE', archetype: 'Economist' },
  { id: 'kennedy', name: 'John F. Kennedy', era: '20th century CE', archetype: 'President' },
  { id: 'pincus', name: 'Gregory Pincus', era: '20th century CE', archetype: 'Scientist' },
  { id: 'mani', name: 'Mani', era: '3rd century CE', archetype: 'Prophet' },
  { id: 'lenin', name: 'Vladimir Lenin', era: '20th century CE', archetype: 'Revolutionary' },
  { id: 'emperor-wen', name: 'Emperor Wen of Sui', era: '6th–7th century CE', archetype: 'Emperor' },
  { id: 'vasco-da-gama', name: 'Vasco da Gama', era: 'Age of Discovery', archetype: 'Explorer' },
  { id: 'cyrus', name: 'Cyrus the Great', era: '6th century BCE', archetype: 'King' },
  { id: 'peter-great', name: 'Peter the Great', era: '17th–18th century CE', archetype: 'Emperor' },
  { id: 'mao', name: 'Mao Zedong', era: '20th century CE', archetype: 'Leader' },
  { id: 'bacon', name: 'Francis Bacon', era: 'Late Renaissance', archetype: 'Philosopher' },
  { id: 'ford', name: 'Henry Ford', era: '19th–20th century CE', archetype: 'Industrialist' },
  { id: 'mencius', name: 'Mencius', era: 'Warring States period', archetype: 'Philosopher' },
  { id: 'zoroaster', name: 'Zoroaster', era: 'Ancient Iranian antiquity', archetype: 'Prophet' },
  { id: 'elizabeth', name: 'Elizabeth I', era: '16th century CE', archetype: 'Queen' },
  { id: 'gorbachev', name: 'Mikhail Gorbachev', era: '20th–21st century CE', archetype: 'Leader' },
  { id: 'menes', name: 'Menes', era: 'Early Dynastic Period', archetype: 'Pharaoh' },
  { id: 'charlemagne', name: 'Charlemagne', era: 'Early Middle Ages', archetype: 'Emperor' },
  { id: 'homer', name: 'Homer', era: 'Archaic Greece', archetype: 'Poet' },
  { id: 'justinian', name: 'Justinian I', era: '6th century CE', archetype: 'Emperor' },
  { id: 'mahavira', name: 'Mahavira', era: '6th century BCE', archetype: 'Spiritual Leader' }
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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCharacters = CHARACTERS.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.archetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.era.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGenerationIcon = (type: GenerationType) => {
    switch (type) {
      case 'image': return '🎨';
      case 'audio': return '🎵';
      case 'video': return '🎬';
      case 'text': return '📝';
      case 'texture': return '🔲';
      case 'og-card': return '📱';
      case 'scientific': return '🔬';
      case 'educational': return '📚';
      case 'music': return '🎼';
      case 'midi': return '🎹';
      case 'video-from-image': return '🖼️→🎬';
      case 'reasoning': return '🧠';
      case 'multimodal': return '🌟';
      default: return '✨';
    }
  };

  const getGenerationPlaceholder = (type: GenerationType) => {
    switch (type) {
      case 'image': return `Describe an image of ${selectedCharacter.name}...`;
      case 'audio': return `Describe audio content for ${selectedCharacter.name}...`;
      case 'video': return `Describe a video scene with ${selectedCharacter.name}...`;
      case 'text': return `What would ${selectedCharacter.name} say about...`;
      case 'texture': return `Describe a seamless texture pattern...`;
      case 'og-card': return `Enter title for social media card...`;
      case 'scientific': return `Describe scientific visualization topic...`;
      case 'educational': return `Enter educational topic...`;
      case 'music': return `Describe music composition...`;
      case 'midi': return `Describe MIDI composition...`;
      case 'video-from-image': return `Enter image URL to animate...`;
      case 'reasoning': return `Ask for detailed analysis...`;
      case 'multimodal': return `Describe content for all formats...`;
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

      let content = '';
      
      if (response.ok) {
        const data = await response.json();
        
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
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-purple-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Enhanced Multi-Modal Chat</h2>
                <p className="text-sm opacity-90">Chat with 100+ historical figures & generate content</p>
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
            <div className="space-y-3 mt-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search characters by name, era, or archetype..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Character Grid */}
              <div className="max-h-64 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {filteredCharacters.map(character => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterChange(character)}
                    className={`p-2 rounded-lg text-xs transition-all hover:scale-105 ${
                      selectedCharacter.id === character.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                    title={`${character.name} - ${character.archetype} (${character.era})`}
                  >
                    <div className="font-semibold text-xs mb-1 truncate">{character.name}</div>
                    <div className="text-xs opacity-75 truncate">{character.archetype}</div>
                    <div className="text-xs opacity-60 truncate">{character.era}</div>
                  </button>
                ))}
              </div>

              {filteredCharacters.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  No characters found matching "{searchTerm}"
                </div>
              )}
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
                <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }} />
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
              <div className="space-y-3">
                {/* Primary Types */}
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
                
                {/* Advanced Types */}
                <div className="flex gap-2 flex-wrap">
                  {(['texture', 'og-card', 'scientific', 'educational', 'music', 'midi'] as GenerationType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setGenerationType(type)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        generationType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {getGenerationIcon(type)} {type.replace('-', ' ').charAt(0).toUpperCase() + type.replace('-', ' ').slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Experimental Types */}
                <div className="flex gap-2 flex-wrap">
                  {(['video-from-image', 'reasoning', 'multimodal'] as GenerationType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setGenerationType(type)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        generationType === type
                          ? 'bg-green-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {getGenerationIcon(type)} {type.replace('-', ' ').charAt(0).toUpperCase() + type.replace('-', ' ').slice(1)}
                    </button>
                  ))}
                </div>
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
