# Great Humans TypeScript SDK

Mini-SDK TypeScript pentru acces facil la agenții istorici din dataset-ul Great Humans.

## 🚀 Quick Start

```bash
# Instalează dependențele
npm install

# Compilează TypeScript
npm run build

# Importă în proiectul tău
import { getAgentById, listAgentsByDomain } from './src/agents';
```

## 📦 Installation

```bash
# Copiază directorul src/ în proiectul tău
cp -r src/ /path/to/your/project/

# Sau instalează ca pachet (dacă este publicat)
npm install great-humans-sdk
```

## 🔧 Usage Examples

### Basic Usage

```typescript
import { getAgentById, listAgentsByDomain, getSystemPromptById } from './agents';

// 1. Găsește agentul Einstein
const einstein = getAgentById("hart-010-albert-einstein");
if (einstein) {
  console.log(`Agent: ${einstein.name} (Rank: ${einstein.rank})`);
  console.log(`Archetype: ${einstein.persona.archetype}`);
  console.log(`Domains: ${einstein.categories.domains.join(", ")}`);
}

// 2. Listează toți oamenii de știință
const scientists = listAgentsByDomain("science");
console.log(`Found ${scientists.length} scientists:`);
scientists.slice(0, 5).forEach(agent => {
  console.log(`- ${agent.name} (Rank: ${agent.rank})`);
});

// 3. Obține system prompt pentru LLM
const systemPrompt = getSystemPromptById("hart-010-albert-einstein");
if (systemPrompt) {
  // Folosește systemPrompt cu LLM-ul tău
  console.log(`System prompt: ${systemPrompt.substring(0, 100)}...`);
}
```

### Advanced Usage

```typescript
import {
  searchAgentsByName,
  getTopAgents,
  getAgentsStats,
  listAgentsByEra,
  exportAgentsAsJSON
} from './agents';

// Caută agenți după nume
const napoleon = searchAgentsByName("Napoleon");
napoleon.forEach(agent => {
  console.log(`Found: ${agent.name} - ${agent.persona.archetype}`);
});

// Top 5 agenți
const topAgents = getTopAgents(5);
topAgents.forEach(agent => {
  console.log(`${agent.rank}. ${agent.name} - ${agent.persona.archetype}`);
});

// Statistici despre dataset
const stats = getAgentsStats();
console.log(`Total agents: ${stats.total}`);
console.log(`Domains: ${stats.domains.join(", ")}`);

// Agenți dintr-o eră specifică
const ancientAgents = listAgentsByEra("ancient");
console.log(`Found ${ancientAgents.length} ancient agents`);

// Exportă ca JSON
const jsonExport = exportAgentsAsJSON();
console.log(`JSON export: ${jsonExport.length} characters`);
```

### Orchestrator AI Integration

```typescript
import { listAgentsByDomain, getSystemPromptById, searchAgents } from './agents';

function selectBestAgentForTask(task: string) {
  // Simplificat - în realitate ar folosi scoring mai complex
  const domains = ["science", "technology", "politics", "religion"];
  let bestAgent = null;
  
  for (const domain of domains) {
    const agents = listAgentsByDomain(domain);
    if (agents.length > 0) {
      bestAgent = agents[0];
      break;
    }
  }
  
  return bestAgent;
}

// Exemplu de utilizare
const task = "Design renewable energy solution";
const selectedAgent = selectBestAgentForTask(task);

if (selectedAgent) {
  const systemPrompt = getSystemPromptById(selectedAgent.id);
  
  // Trimite la LLM
  const llmResponse = await callLLM({
    system: systemPrompt,
    user: task
  });
  
  console.log(`Agent: ${selectedAgent.name}`);
  console.log(`Response: ${llmResponse}`);
}
```

## 📚 API Reference

### Types

```typescript
interface HartAgent {
  id: string;
  name: string;
  rank: number;
  categories: HartAgentCategories;
  persona: HartAgentPersona;
  knowledge_profile: HartAgentKnowledgeProfile;
  limitations: string[];
  prompt_template: string;
}

interface HartAgentCategories {
  domains: string[];
  subdomains: string[];
  impact_tags: string[];
}

interface HartAgentPersona {
  archetype: string;
  core_values: string[];
  cognitive_style: string[];
  communication_style: string[];
}

interface HartAgentKnowledgeProfile {
  expertise: string[];
  era: string;
  regions: string[];
}
```

### Functions

#### `listAgents(): HartAgent[]`
Returnează toți agenții din dataset.

#### `getAgentById(id: string): HartAgent | undefined`
Găsește un agent după ID-ul intern.

#### `getAgentByRank(rank: number): HartAgent | undefined`
Găsește un agent după rank-ul Hart (1-100).

#### `listAgentsByDomain(domain: string): HartAgent[]`
Listează agenții care acoperă un domeniu specific.

#### `listAgentsByImpactTag(tag: string): HartAgent[]`
Listează agenții care au un impact tag specific.

#### `searchAgentsByName(query: string): HartAgent[]`
Caută agenți după nume (fuzzy search).

#### `searchAgents(query: string): HartAgent[]`
Caută agenți după orice câmp (fuzzy search).

#### `listAgentsByEra(era: string): HartAgent[]`
Listează agenți dintr-o eră specifică.

#### `listAgentsByRegion(region: string): HartAgent[]`
Listează agenți dintr-o regiune specifică.

#### `buildSystemPrompt(agent: HartAgent): string`
Construiește system prompt pentru un agent.

#### `getSystemPromptById(id: string): string | undefined`
Obține system prompt direct după ID.

#### `getSystemPromptByRank(rank: number): string | undefined`
Obține system prompt direct după rank.

#### `getAgentsStats(): Stats`
Returnează statistici despre agenți.

#### `getTopAgents(limit?: number): HartAgent[]`
Returnează top N agenți după rank.

#### `getAgentsByRankRange(start: number, end: number): HartAgent[]`
Returnează agenți dintr-un interval de ranguri.

#### `agentExists(id: string): boolean`
Verifică dacă un agent există.

#### `rankExists(rank: number): boolean`
Verifică dacă un rank există.

#### `exportAgentsAsJSON(): string`
Exportă agenți ca JSON.

#### `exportAgentsAsCSV(): string`
Exportă agenți ca CSV.

## 🧪 Testing

```typescript
import { runTests } from './test';

// Rulează toate testele
const success = runTests();
console.log(`Tests ${success ? 'passed' : 'failed'}`);
```

## 🏗️ Build

```bash
# Compilează TypeScript
npm run build

# Watch mode pentru dezvoltare
npm run dev

# Clean build
npm run clean
```

## 📁 File Structure

```
src/
├── agents.ts      # Main SDK implementation
├── index.ts       # Export principal
├── example.ts     # Usage examples
├── test.ts        # Test suite
└── README.md      # This file
```

## 🤝 Contributing

1. Clonează repository-ul
2. Modifică fișierele TypeScript
3. Rulează testele: `npm run test`
4. Commit și push

## 📄 License

MIT License - vezi fișierul LICENSE din repository-ul principal.

## 🔗 Links

- [Repository Principal](https://github.com/Gzeu/100-great-humans)
- [Dataset](https://github.com/Gzeu/100-great-humans/tree/main/data/people)
- [API Documentation](https://github.com/Gzeu/100-great-humans/tree/main/api)
