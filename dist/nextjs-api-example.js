"use strict";
/**
 * Great Humans TypeScript SDK - Next.js API Routes Example
 *
 * Exemplu simplu de API routes pentru Next.js folosind SDK-ul
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_AGENT = GET_AGENT;
exports.LIST_AGENTS_BY_DOMAIN = LIST_AGENTS_BY_DOMAIN;
exports.SEARCH_AGENTS = SEARCH_AGENTS;
exports.GET_TOP_AGENTS = GET_TOP_AGENTS;
exports.GET_SYSTEM_PROMPT = GET_SYSTEM_PROMPT;
exports.GET_STATS = GET_STATS;
exports.LIST_ALL_AGENTS = LIST_ALL_AGENTS;
exports.GET_AGENTS_BATCH = GET_AGENTS_BATCH;
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
/**
 * API Route pentru a lista toți agenții cu paginare
 * GET /api/agents?page=1&limit=20
 */
async function LIST_ALL_AGENTS(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const allAgents = (0, agents_1.listAgents)();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedAgents = allAgents.slice(startIndex, endIndex);
        return server_1.NextResponse.json({
            success: true,
            data: paginatedAgents,
            pagination: {
                page,
                limit,
                total: allAgents.length,
                totalPages: Math.ceil(allAgents.length / limit),
                hasNext: endIndex < allAgents.length,
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * API Route pentru a obține agenți multipli după ID-uri
 * POST /api/agents/batch
 */
async function GET_AGENTS_BATCH(request) {
    try {
        const body = await request.json();
        const { ids } = body;
        if (!Array.isArray(ids)) {
            return server_1.NextResponse.json({ error: 'IDs must be an array' }, { status: 400 });
        }
        const agents = [];
        const notFound = [];
        for (const id of ids) {
            const agent = (0, agents_1.getAgentById)(id);
            if (agent) {
                agents.push(agent);
            }
            else {
                notFound.push(id);
            }
        }
        return server_1.NextResponse.json({
            success: true,
            data: agents,
            notFound,
            requested: ids.length,
            found: agents.length
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
    }
}
/**
 * Exemplu de utilizare în Next.js pages/api/agents/[id]/route.ts
 */
/*
import { GET_AGENT, GET_SYSTEM_PROMPT } from '@/src/nextjs-api-example';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Alege ce funcție să rulezi bazat pe endpoint
  const url = new URL(request.url);
  
  if (url.pathname.endsWith('/prompt')) {
    return GET_SYSTEM_PROMPT(request, { params });
  }
  
  return GET_AGENT(request, { params });
}
*/
/**
 * Exemplu de utilizare în Next.js pages/api/agents/route.ts
 */
/*
import { LIST_ALL_AGENTS, SEARCH_AGENTS, GET_TOP_AGENTS } from '@/src/nextjs-api-example';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  if (url.searchParams.has('q')) {
    return SEARCH_AGENTS(request);
  }
  
  if (url.searchParams.has('top')) {
    return GET_TOP_AGENTS(request);
  }
  
  return LIST_ALL_AGENTS(request);
}
*/
//# sourceMappingURL=nextjs-api-example.js.map