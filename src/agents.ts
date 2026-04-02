/**
 * Great Humans TypeScript SDK
 * 
 * Mini-SDK pentru acces facil la agenții istorici din dataset-ul Hart.
 * Importă direct din output/agents-hart-100.json și expune funcții de bază.
 * 
 * @author Great Humans Project
 * @version 1.0.0
 */

import fs from "fs";
import path from "path";

/**
 * Tipuri de bază extrase din output/agents-hart-100.json
 * Structură bazată pe datele existente în JSON
 */
export interface HartAgentCategories {
  domains: string[];
  subdomains: string[];
  impact_tags: string[];
}

export interface HartAgentPersona {
  archetype: string;
  core_values: string[];
  cognitive_style: string[];
  communication_style: string[];
}

export interface HartAgentKnowledgeProfile {
  expertise: string[];
  era: string;
  regions: string[];
}

export interface HartAgent {
  id: string;                 // ex: "hart-001-muhammad"
  name: string;               // ex: "Muhammad"
  rank: number;               // 1–100, după Hart
  categories: HartAgentCategories;
  persona: HartAgentPersona;
  knowledge_profile: HartAgentKnowledgeProfile;
  limitations: string[];
  prompt_template: string;    // system prompt gata de folosit cu LLM
}

/**
 * Calea relativă către fișierul JSON
 * Presupune că src/agents.ts este în src/ și JSON-ul în output/
 */
const AGENTS_JSON_PATH = path.resolve(
  __dirname,
  "..",
  "output",
  "agents-hart-100.json"
);

/**
 * Cache pentru a evita citiri repetate
 */
let AGENTS_CACHE: HartAgent[] | null = null;

/**
 * Încarcă JSON-ul o singură dată la import
 * @returns Array de HartAgent
 */
function loadAgents(): HartAgent[] {
  if (AGENTS_CACHE) return AGENTS_CACHE;

  try {
    const raw = fs.readFileSync(AGENTS_JSON_PATH, "utf-8");
    const parsed = JSON.parse(raw) as HartAgent[];
    
    // Sortăm după rank pentru consistență
    parsed.sort((a, b) => a.rank - b.rank);
    
    AGENTS_CACHE = parsed;
    return AGENTS_CACHE;
  } catch (error) {
    console.error("Error loading agents JSON:", error);
    return [];
  }
}

/**
 * Returnează toți agenții (clonați superficial)
 * @returns Array de HartAgent
 */
export function listAgents(): HartAgent[] {
  return loadAgents().map(a => ({ ...a }));
}

/**
 * Găsește un agent după ID-ul intern
 * @param id - ID-ul agentului (ex: "hart-001-muhammad")
 * @returns Agent sau undefined
 */
export function getAgentById(id: string): HartAgent | undefined {
  return loadAgents().find(a => a.id === id);
}

/**
 * Găsește un agent după rank-ul Hart (1–100)
 * @param rank - Rank-ul Hart (1-100)
 * @returns Agent sau undefined
 */
export function getAgentByRank(rank: number): HartAgent | undefined {
  return loadAgents().find(a => a.rank === rank);
}

/**
 * Listează agenții care acoperă un domeniu specific
 * @param domain - Domeniul (case-insensitive)
 * @returns Array de agenți
 */
export function listAgentsByDomain(domain: string): HartAgent[] {
  const d = domain.toLowerCase();
  return loadAgents().filter(a =>
    a.categories.domains.some(dom => dom.toLowerCase() === d)
  );
}

/**
 * Listează agenții care au un impact tag specific
 * @param tag - Tag-ul de impact (case-insensitive)
 * @returns Array de agenți
 */
export function listAgentsByImpactTag(tag: string): HartAgent[] {
  const t = tag.toLowerCase();
  return loadAgents().filter(a =>
    a.categories.impact_tags.some(it => it.toLowerCase() === t)
  );
}

/**
 * Caută agenți după nume (fuzzy search)
 * @param query - Text de căutat (case-insensitive)
 * @returns Array de agenți care conțin query
 */
export function searchAgentsByName(query: string): HartAgent[] {
  const q = query.toLowerCase();
  return loadAgents().filter(a => a.name.toLowerCase().includes(q));
}

/**
 * Caută agenți după orice câmp (fuzzy search)
 * @param query - Text de căutat
 * @returns Array de agenți care conțin query în orice câmp
 */
export function searchAgents(query: string): HartAgent[] {
  const q = query.toLowerCase();
  return loadAgents().filter(a => 
    a.name.toLowerCase().includes(q) ||
    a.persona.archetype.toLowerCase().includes(q) ||
    a.categories.domains.some(dom => dom.toLowerCase().includes(q)) ||
    a.categories.impact_tags.some(tag => tag.toLowerCase().includes(q))
  );
}

/**
 * Listează agenți dintr-o eră specifică
 * @param era - Era (case-insensitive)
 * @returns Array de agenți din era respectivă
 */
export function listAgentsByEra(era: string): HartAgent[] {
  const e = era.toLowerCase();
  return loadAgents().filter(a => 
    a.knowledge_profile.era.toLowerCase().includes(e)
  );
}

/**
 * Listează agenți dintr-o regiune specifică
 * @param region - Regiunea (case-insensitive)
 * @returns Array de agenți din regiunea respectivă
 */
export function listAgentsByRegion(region: string): HartAgent[] {
  const r = region.toLowerCase();
  return loadAgents().filter(a => 
    a.knowledge_profile.regions.some(reg => reg.toLowerCase().includes(r))
  );
}

/**
 * Construiește system prompt pentru un agent
 * @param agent - Agentul pentru care se construiește prompt-ul
 * @returns System prompt gata de folosit cu LLM
 */
export function buildSystemPrompt(agent: HartAgent): string {
  return agent.prompt_template;
}

/**
 * Helper pentru a obține system prompt direct după ID
 * @param id - ID-ul agentului
 * @returns System prompt sau undefined
 */
export function getSystemPromptById(id: string): string | undefined {
  const agent = getAgentById(id);
  return agent ? buildSystemPrompt(agent) : undefined;
}

/**
 * Helper pentru a obține system prompt direct după rank
 * @param rank - Rank-ul agentului (1-100)
 * @returns System prompt sau undefined
 */
export function getSystemPromptByRank(rank: number): string | undefined {
  const agent = getAgentByRank(rank);
  return agent ? buildSystemPrompt(agent) : undefined;
}

/**
 * Returnează statistici despre agenți
 * @returns Obiect cu statistici
 */
interface AgentStats {
  total: number;
  domains: string[];
  eras: string[];
  regions: string[];
  impactTags: string[];
  ranks: number[];
}

export function getAgentsStats(): AgentStats {
  const agents = loadAgents();
  
  const domains = new Set<string>();
  const eras = new Set<string>();
  const regions = new Set<string>();
  const impactTags = new Set<string>();
  
  agents.forEach(agent => {
    agent.categories.domains.forEach(dom => domains.add(dom));
    agent.categories.subdomains.forEach(sub => domains.add(sub));
    agent.categories.impact_tags.forEach(tag => impactTags.add(tag));
    agent.knowledge_profile.era.split(',').forEach(era => eras.add(era.trim()));
    agent.knowledge_profile.regions.forEach(region => regions.add(region));
  });
  
  return {
    total: agents.length,
    domains: Array.from(domains).sort(),
    eras: Array.from(eras).sort(),
    regions: Array.from(regions).sort(),
    impactTags: Array.from(impactTags).sort(),
    ranks: agents.map(a => a.rank).sort((a, b) => a - b)
  };
}

/**
 * Returnează top N agenți după rank
 * @param limit - Numărul de agenți de returnat
 * @returns Array de agenți top
 */
export function getTopAgents(limit: number = 10): HartAgent[] {
  return loadAgents().slice(0, limit);
}

/**
 * Returnează agenți dintr-un interval de ranguri
 * @param start - Rang de start (inclusiv)
 * @param end - Rang de sfârșit (inclusiv)
 * @returns Array de agenți din interval
 */
export function getAgentsByRankRange(start: number, end: number): HartAgent[] {
  return loadAgents().filter(a => a.rank >= start && a.rank <= end);
}

/**
 * Verifică dacă un agent există
 * @param id - ID-ul agentului
 * @returns true dacă agentul există
 */
export function agentExists(id: string): boolean {
  return getAgentById(id) !== undefined;
}

/**
 * Verifică dacă un rank există
 * @param rank - Rank-ul de verificat
 * @returns true dacă rank-ul există
 */
export function rankExists(rank: number): boolean {
  return getAgentByRank(rank) !== undefined;
}

/**
 * Exportă agenți ca JSON pentru API usage
 * @returns Array de agenți în format JSON
 */
export function exportAgentsAsJSON(): string {
  return JSON.stringify(loadAgents(), null, 2);
}

/**
 * Exportă agenți ca CSV pentru analiză
 * @returns String CSV format
 */
export function exportAgentsAsCSV(): string {
  const agents = loadAgents();
  
  const headers = [
    'id', 'name', 'rank', 'domains', 'impact_tags', 'archetype', 'era', 'regions'
  ];
  
  const csvLines = [headers.join(',')];
  
  agents.forEach(agent => {
    const row = [
      agent.id,
      `"${agent.name}"`,
      agent.rank,
      `"${agent.categories.domains.join(';')}"`,
      `"${agent.categories.impact_tags.join(';')}"`,
      `"${agent.persona.archetype}"`,
      `"${agent.knowledge_profile.era}"`,
      `"${agent.knowledge_profile.regions.join(';')}"`
    ];
    csvLines.push(row.join(','));
  });
  
  return csvLines.join('\n');
}
