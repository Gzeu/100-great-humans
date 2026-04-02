"use strict";
/**
 * Great Humans TypeScript SDK - Next.js Integration Example
 *
 * Exemplu complet de integrare a SDK-ului într-un proiect Next.js
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_AGENT = GET_AGENT;
exports.LIST_AGENTS_BY_DOMAIN = LIST_AGENTS_BY_DOMAIN;
exports.SEARCH_AGENTS = SEARCH_AGENTS;
exports.GET_TOP_AGENTS = GET_TOP_AGENTS;
exports.GET_SYSTEM_PROMPT = GET_SYSTEM_PROMPT;
exports.GET_STATS = GET_STATS;
exports.AgentCard = AgentCard;
exports.AgentList = AgentList;
exports.useGreatHumansSDK = useGreatHumansSDK;
exports.default = GreatHumansPage;
const server_1 = require("next/server");
const agents_1 = require("./agents");
/**
 * API Route pentru a obține un agent specific
 * GET /api/agents/[id]
 */
async function GET_AGENT(request, { params }) {
    try {
        const agent = (0, agents_1.getAgentById)(params.id);
        if (!agent) {
            return server_1.NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }
        return server_1.NextResponse.json({
            success: true,
            data: agent
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * API Route pentru a lista agenți după domeniu
 * GET /api/agents/domain/[domain]
 */
async function LIST_AGENTS_BY_DOMAIN(request, { params }) {
    try {
        const agents = (0, agents_1.listAgentsByDomain)(params.domain);
        return server_1.NextResponse.json({
            success: true,
            data: agents,
            count: agents.length
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * API Route pentru a căuta agenți
 * GET /api/agents/search?q=query
 */
async function SEARCH_AGENTS(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        if (!query) {
            return server_1.NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
        }
        const agents = (0, agents_1.searchAgentsByName)(query);
        return server_1.NextResponse.json({
            success: true,
            data: agents,
            count: agents.length,
            query
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * API Route pentru a obține top agenți
 * GET /api/agents/top?limit=10
 */
async function GET_TOP_AGENTS(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const agents = (0, agents_1.getTopAgents)(limit);
        return server_1.NextResponse.json({
            success: true,
            data: agents,
            count: agents.length
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * API Route pentru a obține system prompt
 * GET /api/agents/[id]/prompt
 */
async function GET_SYSTEM_PROMPT(request, { params }) {
    try {
        const prompt = (0, agents_1.getSystemPromptById)(params.id);
        if (!prompt) {
            return server_1.NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }
        return server_1.NextResponse.json({
            success: true,
            data: {
                agent_id: params.id,
                system_prompt: prompt,
                length: prompt.length
            }
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * API Route pentru statistici
 * GET /api/agents/stats
 */
async function GET_STATS(request) {
    try {
        const stats = (0, agents_1.getAgentsStats)();
        return server_1.NextResponse.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
function AgentCard({ agent, onSelect }) {
    return className = "border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer";
    onClick = {}();
    onSelect?.(agent);
}
    >
        className;
"text-lg font-bold" > { agent, : .name } < /h3>
    < p;
className = "text-sm text-gray-600" > Rank;
{
    agent.rank;
}
/p>
    < p;
className = "text-sm text-gray-600" > Archetype;
{
    agent.persona.archetype;
}
/p>
    < div;
className = "mt-2" >
    className;
"text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded" >
    { agent, : .categories.domains.join(', ') }
    < /span>
    < /div>
    < /div>;
;
function AgentList({ agents, onAgentSelect }) {
    return className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
        { agents, : .map((agent) => key = { agent, : .id }, agent = { agent }, onSelect = { onAgentSelect }
                /  >
            ) }
        < /div>;
    ;
}
/**
 * React Hook pentru a folosi SDK-ul
 */
const react_1 = require("react");
function useGreatHumansSDK() {
    const [agents, setAgents] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        async function loadData() {
            try {
                setLoading(true);
                const { listAgents, getAgentsStats } = await Promise.resolve().then(() => __importStar(require('./agents')));
                const agentsData = listAgents();
                const statsData = getAgentsStats();
                setAgents(agentsData);
                setStats(statsData);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);
    const searchAgents = (query) => {
        // Implementare locală pentru căutare
        return agents.filter(agent => agent.name.toLowerCase().includes(query.toLowerCase()) ||
            agent.persona.archetype.toLowerCase().includes(query.toLowerCase()));
    };
    const getAgentsByDomain = (domain) => {
        return agents.filter(agent => agent.categories.domains.some((d) => d.toLowerCase() === domain.toLowerCase()));
    };
    return {
        agents,
        stats,
        loading,
        error,
        searchAgents,
        getAgentsByDomain,
        refreshData: () => {
            setLoading(true);
            // Re-load data
        }
    };
}
/**
 * Exemplu de pagină Next.js
 */
function GreatHumansPage() {
    const { agents, stats, loading, error, searchAgents, getAgentsByDomain } = useGreatHumansSDK();
    const [selectedAgent, setSelectedAgent] = (0, react_1.useState)(null);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedDomain, setSelectedDomain] = (0, react_1.useState)('');
    if (loading) {
        return Loading;
        /div>;
    }
    if (error) {
        return Error;
        {
            error;
        }
        /div>;
    }
    const filteredAgents = searchQuery
        ? searchAgents(searchQuery)
        : selectedDomain
            ? getAgentsByDomain(selectedDomain)
            : agents.slice(0, 12); // Primele 12 agenți
    return className = "container mx-auto px-4 py-8" >
        className;
    "text-3xl font-bold mb-8" > Great;
    Humans;
    Historical;
    Agents < /h1>;
    { /* Stats */ }
    {
        stats && className;
        "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" >
            className;
        "bg-blue-100 p-4 rounded" >
            className;
        "font-bold" > Total;
        Agents < /h3>
            < p;
        className = "text-2xl" > { stats, : .total } < /p>
            < /div>
            < div;
        className = "bg-green-100 p-4 rounded" >
            className;
        "font-bold" > Domains < /h3>
            < p;
        className = "text-2xl" > { stats, : .domains.length } < /p>
            < /div>
            < div;
        className = "bg-yellow-100 p-4 rounded" >
            className;
        "font-bold" > Eras < /h3>
            < p;
        className = "text-2xl" > { stats, : .eras.length } < /p>
            < /div>
            < div;
        className = "bg-purple-100 p-4 rounded" >
            className;
        "font-bold" > Regions < /h3>
            < p;
        className = "text-2xl" > { stats, : .regions.length } < /p>
            < /div>
            < /div>;
    }
    { /* Filters */ }
    className;
    "mb-6 flex flex-col md:flex-row gap-4" >
        type;
    "text";
    placeholder = "Search agents...";
    value = { searchQuery };
    onChange = {}(e);
    setSearchQuery(e.target.value);
}
className = "flex-1 px-4 py-2 border rounded"
    /  >
    value;
{
    selectedDomain;
}
onChange = {}(e);
setSelectedDomain(e.target.value);
className = "px-4 py-2 border rounded"
    >
        value;
"" > All;
Domains < /option>;
{
    stats?.domains.map((domain) => key = { domain }, value = { domain } > { domain } < /option>);
}
/select>
    < /div>;
{ /* Agent List */ }
agents;
{
    filteredAgents;
}
onAgentSelect = { setSelectedAgent }
    /  >
    { /* Agent Detail Modal */};
{
    selectedAgent && className;
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
        className;
    "bg-white rounded-lg p-6 max-w-2xl w-full mx-4" >
        className;
    "text-2xl font-bold mb-4" > { selectedAgent, : .name } < /h2>
        < div;
    className = "space-y-4" >
        className;
    "font-bold" > Rank;
    /h3>
        < p > { selectedAgent, : .rank } < /p>
        < /div>
        < div >
        className;
    "font-bold" > Archetype;
    /h3>
        < p > { selectedAgent, : .persona.archetype } < /p>
        < /div>
        < div >
        className;
    "font-bold" > Domains;
    /h3>
        < p > { selectedAgent, : .categories.domains.join(', ') } < /p>
        < /div>
        < div >
        className;
    "font-bold" > System;
    Prompt: /h3>
        < p;
    className = "text-sm bg-gray-100 p-2 rounded" >
        { selectedAgent, : .prompt_template.substring(0, 200) };
    /p>
        < /div>
        < /div>
        < button;
    onClick = {}();
    setSelectedAgent(null);
}
className = "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
        Close
    < /button>
    < /div>
    < /div>;
/div>;
;
//# sourceMappingURL=nextjs-example.js.map