/**
 * Great Humans TypeScript SDK - Next.js Integration Example
 *
 * Exemplu complet de integrare a SDK-ului într-un proiect Next.js
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
interface AgentCardProps {
    agent: any;
    onSelect?: (agent: any) => void;
}
export declare function AgentCard({ agent, onSelect }: AgentCardProps): string;
/**
 * React Component pentru lista de agenți
 */
interface AgentListProps {
    agents: any[];
    onAgentSelect?: (agent: any) => void;
}
export declare function AgentList({ agents, onAgentSelect }: AgentListProps): boolean;
export declare function useGreatHumansSDK(): {
    agents: any[];
    stats: any;
    loading: boolean;
    error: string | null;
    searchAgents: (query: string) => any[];
    getAgentsByDomain: (domain: string) => any[];
    refreshData: () => void;
};
/**
 * Exemplu de pagină Next.js
 */
export default function GreatHumansPage(): any;
export {};
//# sourceMappingURL=nextjs-example.d.ts.map