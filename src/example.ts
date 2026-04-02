/**
 * Great Humans TypeScript SDK - Example Usage
 * 
 * Exemple de utilizare pentru SDK-ul Great Humans
 * 
 * @author Great Humans Project
 * @version 1.0.0
 */

import {
  getAgentById,
  listAgentsByDomain,
  getSystemPromptById,
  searchAgentsByName,
  getTopAgents,
  getAgentsStats,
  listAgentsByEra
} from './agents';

// Exemplu 1: Găsește și folosește un agent specific
function example1_Einstein() {
  console.log("=== Exemplu 1: Albert Einstein ===");
  
  const einstein = getAgentById("hart-010-albert-einstein");
  if (einstein) {
    console.log(`Agent: ${einstein.name} (Rank: ${einstein.rank})`);
    console.log(`Archetype: ${einstein.persona.archetype}`);
    console.log(`Domains: ${einstein.categories.domains.join(", ")}`);
    
    const systemPrompt = getSystemPromptById(einstein.id);
    console.log(`System Prompt: ${systemPrompt?.substring(0, 100)}...`);
  }
}

// Exemplu 2: Listează agenți dintr-un domeniu
function example2_Scientists() {
  console.log("\n=== Exemplu 2: Oameni de știință ===");
  
  const scientists = listAgentsByDomain("science");
  console.log(`Found ${scientists.length} scientists:`);
  
  scientists.slice(0, 5).forEach(agent => {
    console.log(`- ${agent.name} (Rank: ${agent.rank})`);
  });
}

// Exemplu 3: Caută agenți după nume
function example3_Search() {
  console.log("\n=== Exemplu 3: Căutare după nume ===");
  
  const napoleon = searchAgentsByName("Napoleon");
  napoleon.forEach(agent => {
    console.log(`Found: ${agent.name} - ${agent.persona.archetype}`);
  });
}

// Exemplu 4: Top agenți
function example4_TopAgents() {
  console.log("\n=== Exemplu 4: Top 5 Agenți ===");
  
  const topAgents = getTopAgents(5);
  topAgents.forEach(agent => {
    console.log(`${agent.rank}. ${agent.name} - ${agent.persona.archetype}`);
  });
}

// Exemplu 5: Statistici
function example5_Stats() {
  console.log("\n=== Exemplu 5: Statistici ===");
  
  const stats = getAgentsStats();
  console.log(`Total agents: ${stats.total}`);
  console.log(`Domains: ${stats.domains.length}`);
  console.log(`Eras: ${stats.eras.length}`);
  console.log(`Regions: ${stats.regions.length}`);
}

// Exemplu 6: Agenți dintr-o eră
function example6_Era() {
  console.log("\n=== Exemplu 6: Agenți din Antichitate ===");
  
  const ancientAgents = listAgentsByEra("ancient");
  console.log(`Found ${ancientAgents.length} ancient agents:`);
  
  ancientAgents.slice(0, 3).forEach(agent => {
    console.log(`- ${agent.name} (${agent.knowledge_profile.era})`);
  });
}

// Exemplu 7: Utilizare în orchestrator AI
function example7_Orchestrator() {
  console.log("\n=== Exemplu 7: Orchestrator AI ===");
  
  // Simulare task: "Design renewable energy solution"
  const taskDescription = "Design renewable energy solution";
  
  // Găsește cel mai bun agent pentru task
  const scientists = listAgentsByDomain("science");
  const engineers = listAgentsByDomain("technology");
  
  const candidates = [...scientists, ...engineers];
  const bestAgent = candidates[0]; // Simplificat - în realitate ar folosi scoring
  
  if (bestAgent) {
    const systemPrompt = getSystemPromptById(bestAgent.id);
    console.log(`Selected agent: ${bestAgent.name}`);
    console.log(`System prompt length: ${systemPrompt?.length} characters`);
    console.log(`Task: ${taskDescription}`);
    
    // Aici ar fi pasat systemPrompt către LLM
    console.log("Ready to send to LLM...");
  }
}

// Rulează toate exemplele
export function runAllExamples() {
  example1_Einstein();
  example2_Scientists();
  example3_Search();
  example4_TopAgents();
  example5_Stats();
  example6_Era();
  example7_Orchestrator();
}

// Export individual examples for testing
export {
  example1_Einstein,
  example2_Scientists,
  example3_Search,
  example4_TopAgents,
  example5_Stats,
  example6_Era,
  example7_Orchestrator
};
