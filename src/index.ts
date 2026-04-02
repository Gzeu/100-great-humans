/**
 * Great Humans TypeScript SDK - Index File
 * 
 * Export principal pentru importuri ușoare
 * 
 * @author Great Humans Project
 * @version 1.0.0
 */

// Import everything from agents.ts
import * as agents from './agents';

// Re-export everything from agents.ts for convenience
export * from './agents';

// Also export as namespace for convenience
export { agents };

// Default export for easy importing
export default agents;
