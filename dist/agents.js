"use strict";
/**
 * Great Humans TypeScript SDK
 *
 * Mini-SDK pentru acces facil la agenții istorici din dataset-ul Hart.
 * Importă direct din output/agents-hart-100.json și expune funcții de bază.
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAgents = listAgents;
exports.getAgentById = getAgentById;
exports.getAgentByRank = getAgentByRank;
exports.listAgentsByDomain = listAgentsByDomain;
exports.listAgentsByImpactTag = listAgentsByImpactTag;
exports.searchAgentsByName = searchAgentsByName;
exports.searchAgents = searchAgents;
exports.listAgentsByEra = listAgentsByEra;
exports.listAgentsByRegion = listAgentsByRegion;
exports.buildSystemPrompt = buildSystemPrompt;
exports.getSystemPromptById = getSystemPromptById;
exports.getSystemPromptByRank = getSystemPromptByRank;
exports.getAgentsStats = getAgentsStats;
exports.getTopAgents = getTopAgents;
exports.getAgentsByRankRange = getAgentsByRankRange;
exports.agentExists = agentExists;
exports.rankExists = rankExists;
exports.exportAgentsAsJSON = exportAgentsAsJSON;
exports.exportAgentsAsCSV = exportAgentsAsCSV;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Calea relativă către fișierul JSON
 * Presupune că src/agents.ts este în src/ și JSON-ul în output/
 */
const AGENTS_JSON_PATH = path_1.default.resolve(__dirname, "..", "output", "agents-hart-100.json");
/**
 * Cache pentru a evita citiri repetate
 */
let AGENTS_CACHE = null;
/**
 * Încarcă JSON-ul o singură dată la import
 * @returns Array de HartAgent
 */
function loadAgents() {
    if (AGENTS_CACHE)
        return AGENTS_CACHE;
    try {
        const raw = fs_1.default.readFileSync(AGENTS_JSON_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        // Sortăm după rank pentru consistență
        parsed.sort((a, b) => a.rank - b.rank);
        AGENTS_CACHE = parsed;
        return AGENTS_CACHE;
    }
    catch (error) {
        console.error("Error loading agents JSON:", error);
        return [];
    }
}
/**
 * Returnează toți agenții (clonați superficial)
 * @returns Array de HartAgent
 */
function listAgents() {
    return loadAgents().map(a => ({ ...a }));
}
/**
 * Găsește un agent după ID-ul intern
 * @param id - ID-ul agentului (ex: "hart-001-muhammad")
 * @returns Agent sau undefined
 */
function getAgentById(id) {
    return loadAgents().find(a => a.id === id);
}
/**
 * Găsește un agent după rank-ul Hart (1–100)
 * @param rank - Rank-ul Hart (1-100)
 * @returns Agent sau undefined
 */
function getAgentByRank(rank) {
    return loadAgents().find(a => a.rank === rank);
}
/**
 * Listează agenții care acoperă un domeniu specific
 * @param domain - Domeniul (case-insensitive)
 * @returns Array de agenți
 */
function listAgentsByDomain(domain) {
    const d = domain.toLowerCase();
    return loadAgents().filter(a => a.categories.domains.some(dom => dom.toLowerCase() === d));
}
/**
 * Listează agenții care au un impact tag specific
 * @param tag - Tag-ul de impact (case-insensitive)
 * @returns Array de agenți
 */
function listAgentsByImpactTag(tag) {
    const t = tag.toLowerCase();
    return loadAgents().filter(a => a.categories.impact_tags.some(it => it.toLowerCase() === t));
}
/**
 * Caută agenți după nume (fuzzy search)
 * @param query - Text de căutat (case-insensitive)
 * @returns Array de agenți care conțin query
 */
function searchAgentsByName(query) {
    const q = query.toLowerCase();
    return loadAgents().filter(a => a.name.toLowerCase().includes(q));
}
/**
 * Caută agenți după orice câmp (fuzzy search)
 * @param query - Text de căutat
 * @returns Array de agenți care conțin query în orice câmp
 */
function searchAgents(query) {
    const q = query.toLowerCase();
    return loadAgents().filter(a => a.name.toLowerCase().includes(q) ||
        a.persona.archetype.toLowerCase().includes(q) ||
        a.categories.domains.some(dom => dom.toLowerCase().includes(q)) ||
        a.categories.impact_tags.some(tag => tag.toLowerCase().includes(q)));
}
/**
 * Listează agenți dintr-o eră specifică
 * @param era - Era (case-insensitive)
 * @returns Array de agenți din era respectivă
 */
function listAgentsByEra(era) {
    const e = era.toLowerCase();
    return loadAgents().filter(a => a.knowledge_profile.era.toLowerCase().includes(e));
}
/**
 * Listează agenți dintr-o regiune specifică
 * @param region - Regiunea (case-insensitive)
 * @returns Array de agenți din regiunea respectivă
 */
function listAgentsByRegion(region) {
    const r = region.toLowerCase();
    return loadAgents().filter(a => a.knowledge_profile.regions.some(reg => reg.toLowerCase().includes(r)));
}
/**
 * Construiește system prompt pentru un agent
 * @param agent - Agentul pentru care se construiește prompt-ul
 * @returns System prompt gata de folosit cu LLM
 */
function buildSystemPrompt(agent) {
    return agent.prompt_template;
}
/**
 * Helper pentru a obține system prompt direct după ID
 * @param id - ID-ul agentului
 * @returns System prompt sau undefined
 */
function getSystemPromptById(id) {
    const agent = getAgentById(id);
    return agent ? buildSystemPrompt(agent) : undefined;
}
/**
 * Helper pentru a obține system prompt direct după rank
 * @param rank - Rank-ul agentului (1-100)
 * @returns System prompt sau undefined
 */
function getSystemPromptByRank(rank) {
    const agent = getAgentByRank(rank);
    return agent ? buildSystemPrompt(agent) : undefined;
}
function getAgentsStats() {
    const agents = loadAgents();
    const domains = new Set();
    const eras = new Set();
    const regions = new Set();
    const impactTags = new Set();
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
function getTopAgents(limit = 10) {
    return loadAgents().slice(0, limit);
}
/**
 * Returnează agenți dintr-un interval de ranguri
 * @param start - Rang de start (inclusiv)
 * @param end - Rang de sfârșit (inclusiv)
 * @returns Array de agenți din interval
 */
function getAgentsByRankRange(start, end) {
    return loadAgents().filter(a => a.rank >= start && a.rank <= end);
}
/**
 * Verifică dacă un agent există
 * @param id - ID-ul agentului
 * @returns true dacă agentul există
 */
function agentExists(id) {
    return getAgentById(id) !== undefined;
}
/**
 * Verifică dacă un rank există
 * @param rank - Rank-ul de verificat
 * @returns true dacă rank-ul există
 */
function rankExists(rank) {
    return getAgentByRank(rank) !== undefined;
}
/**
 * Exportă agenți ca JSON pentru API usage
 * @returns Array de agenți în format JSON
 */
function exportAgentsAsJSON() {
    return JSON.stringify(loadAgents(), null, 2);
}
/**
 * Exportă agenți ca CSV pentru analiză
 * @returns String CSV format
 */
function exportAgentsAsCSV() {
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
//# sourceMappingURL=agents.js.map