/**
 * Great Humans TypeScript SDK
 *
 * Mini-SDK pentru acces facil la agenții istorici din dataset-ul Hart.
 * Importă direct din output/agents-hart-100.json și expune funcții de bază.
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
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
    id: string;
    name: string;
    rank: number;
    categories: HartAgentCategories;
    persona: HartAgentPersona;
    knowledge_profile: HartAgentKnowledgeProfile;
    limitations: string[];
    prompt_template: string;
}
/**
 * Returnează toți agenții (clonați superficial)
 * @returns Array de HartAgent
 */
export declare function listAgents(): HartAgent[];
/**
 * Găsește un agent după ID-ul intern
 * @param id - ID-ul agentului (ex: "hart-001-muhammad")
 * @returns Agent sau undefined
 */
export declare function getAgentById(id: string): HartAgent | undefined;
/**
 * Găsește un agent după rank-ul Hart (1–100)
 * @param rank - Rank-ul Hart (1-100)
 * @returns Agent sau undefined
 */
export declare function getAgentByRank(rank: number): HartAgent | undefined;
/**
 * Listează agenții care acoperă un domeniu specific
 * @param domain - Domeniul (case-insensitive)
 * @returns Array de agenți
 */
export declare function listAgentsByDomain(domain: string): HartAgent[];
/**
 * Listează agenții care au un impact tag specific
 * @param tag - Tag-ul de impact (case-insensitive)
 * @returns Array de agenți
 */
export declare function listAgentsByImpactTag(tag: string): HartAgent[];
/**
 * Caută agenți după nume (fuzzy search)
 * @param query - Text de căutat (case-insensitive)
 * @returns Array de agenți care conțin query
 */
export declare function searchAgentsByName(query: string): HartAgent[];
/**
 * Caută agenți după orice câmp (fuzzy search)
 * @param query - Text de căutat
 * @returns Array de agenți care conțin query în orice câmp
 */
export declare function searchAgents(query: string): HartAgent[];
/**
 * Listează agenți dintr-o eră specifică
 * @param era - Era (case-insensitive)
 * @returns Array de agenți din era respectivă
 */
export declare function listAgentsByEra(era: string): HartAgent[];
/**
 * Listează agenți dintr-o regiune specifică
 * @param region - Regiunea (case-insensitive)
 * @returns Array de agenți din regiunea respectivă
 */
export declare function listAgentsByRegion(region: string): HartAgent[];
/**
 * Construiește system prompt pentru un agent
 * @param agent - Agentul pentru care se construiește prompt-ul
 * @returns System prompt gata de folosit cu LLM
 */
export declare function buildSystemPrompt(agent: HartAgent): string;
/**
 * Helper pentru a obține system prompt direct după ID
 * @param id - ID-ul agentului
 * @returns System prompt sau undefined
 */
export declare function getSystemPromptById(id: string): string | undefined;
/**
 * Helper pentru a obține system prompt direct după rank
 * @param rank - Rank-ul agentului (1-100)
 * @returns System prompt sau undefined
 */
export declare function getSystemPromptByRank(rank: number): string | undefined;
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
export declare function getAgentsStats(): AgentStats;
/**
 * Returnează top N agenți după rank
 * @param limit - Numărul de agenți de returnat
 * @returns Array de agenți top
 */
export declare function getTopAgents(limit?: number): HartAgent[];
/**
 * Returnează agenți dintr-un interval de ranguri
 * @param start - Rang de start (inclusiv)
 * @param end - Rang de sfârșit (inclusiv)
 * @returns Array de agenți din interval
 */
export declare function getAgentsByRankRange(start: number, end: number): HartAgent[];
/**
 * Verifică dacă un agent există
 * @param id - ID-ul agentului
 * @returns true dacă agentul există
 */
export declare function agentExists(id: string): boolean;
/**
 * Verifică dacă un rank există
 * @param rank - Rank-ul de verificat
 * @returns true dacă rank-ul există
 */
export declare function rankExists(rank: number): boolean;
/**
 * Exportă agenți ca JSON pentru API usage
 * @returns Array de agenți în format JSON
 */
export declare function exportAgentsAsJSON(): string;
/**
 * Exportă agenți ca CSV pentru analiză
 * @returns String CSV format
 */
export declare function exportAgentsAsCSV(): string;
export {};
//# sourceMappingURL=agents.d.ts.map