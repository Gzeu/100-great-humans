/**
 * Great Humans TypeScript SDK - Next.js API Routes Example
 *
 * Exemplu simplu de API routes pentru Next.js folosind SDK-ul
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
import { NextRequest } from 'next/server';
/**
 * API Route pentru a obține un agent specific
 * GET /api/agents/[id]
 */
export declare function GET_AGENT(request: NextRequest, { params }: {
    params: {
        id: string;
    };
}): Promise<any>;
/**
 * API Route pentru a lista agenți după domeniu
 * GET /api/agents/domain/[domain]
 */
export declare function LIST_AGENTS_BY_DOMAIN(request: NextRequest, { params }: {
    params: {
        domain: string;
    };
}): Promise<any>;
/**
 * API Route pentru a căuta agenți
 * GET /api/agents/search?q=query
 */
export declare function SEARCH_AGENTS(request: NextRequest): Promise<any>;
/**
 * API Route pentru a obține top agenți
 * GET /api/agents/top?limit=10
 */
export declare function GET_TOP_AGENTS(request: NextRequest): Promise<any>;
/**
 * API Route pentru a obține system prompt
 * GET /api/agents/[id]/prompt
 */
export declare function GET_SYSTEM_PROMPT(request: NextRequest, { params }: {
    params: {
        id: string;
    };
}): Promise<any>;
/**
 * API Route pentru statistici
 * GET /api/agents/stats
 */
export declare function GET_STATS(request: NextRequest): Promise<any>;
/**
 * API Route pentru a lista toți agenții cu paginare
 * GET /api/agents?page=1&limit=20
 */
export declare function LIST_ALL_AGENTS(request: NextRequest): Promise<any>;
/**
 * API Route pentru a obține agenți multipli după ID-uri
 * POST /api/agents/batch
 */
export declare function GET_AGENTS_BATCH(request: NextRequest): Promise<any>;
/**
 * Exemplu de utilizare în Next.js pages/api/agents/[id]/route.ts
 */
/**
 * Exemplu de utilizare în Next.js pages/api/agents/route.ts
 */
//# sourceMappingURL=nextjs-api-example.d.ts.map