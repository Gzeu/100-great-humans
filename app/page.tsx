'use client';

import agents from '../output/agents-hart-100.json';
import { useState } from 'react';
import MultiModalChatInterface from '../components/MultiModalChatInterface';

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

export default function HomePage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const allAgents = agents as Agent[];
  const sorted = [...allAgents].sort((a, b) => a.rank - b.rank);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Historical Agent Dataset
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            100 Great Humans
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            A curated library of 100 influential historical figures — with biographies, domains, rankings, and multi-modal AI interactions including chat, images, audio, and video generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Gzeu/100-great-humans"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              View on GitHub
            </a>
            <a
              href="#agents"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse All {sorted.length} Agents
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Agents', value: sorted.length },
            { label: 'Unique Domains', value: [...new Set(sorted.flatMap(a => a.categories.domains))].length },
            { label: 'Historical Eras', value: [...new Set(sorted.map(a => a.knowledge_profile.era))].length },
            { label: 'Regions', value: [...new Set(sorted.flatMap(a => a.knowledge_profile.regions))].length },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agents Grid */}
      <section id="agents" className="container mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">All 100 Historical Figures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map(agent => (
            <article
              key={agent.id}
              className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                  #{agent.rank}
                </span>
                <span className="text-xs text-gray-500">{agent.knowledge_profile.era.split(',')[0].trim()}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-purple-300 mb-3 italic">{agent.persona.archetype}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.categories.domains.slice(0, 3).map(domain => (
                  <span
                    key={domain}
                    className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20"
                  >
                    {domain}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedAgent(agent)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Multi-Modal Chat
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Multi-Modal Chat Interface */}
      {selectedAgent && (
        <MultiModalChatInterface 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </main>
  );
}
