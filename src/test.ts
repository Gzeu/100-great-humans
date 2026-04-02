/**
 * Great Humans TypeScript SDK - Test Suite
 * 
 * Teste simple pentru a verifica funcționalitatea SDK-ului
 * 
 * @author Great Humans Project
 * @version 1.0.0
 */

import {
  listAgents,
  getAgentById,
  getAgentByRank,
  listAgentsByDomain,
  searchAgentsByName,
  getTopAgents,
  getAgentsStats,
  agentExists,
  rankExists
} from './agents';

/**
 * Test suite pentru Great Humans SDK
 */
export class GreatHumansTestSuite {
  private tests: { name: string; test: () => boolean }[] = [];
  
  constructor() {
    this.setupTests();
  }
  
  private setupTests() {
    // Test 1: Verifică încărcarea agenților
    this.tests.push({
      name: "Load agents",
      test: () => {
        const agents = listAgents();
        return agents.length === 100;
      }
    });
    
    // Test 2: Verifică getAgentById
    this.tests.push({
      name: "Get agent by ID",
      test: () => {
        const muhammad = getAgentById("hart-001-muhammad");
        return muhammad !== undefined && muhammad.name === "Muhammad";
      }
    });
    
    // Test 3: Verifică getAgentByRank
    this.tests.push({
      name: "Get agent by rank",
      test: () => {
        const newton = getAgentByRank(2);
        return newton !== undefined && newton.name === "Isaac Newton";
      }
    });
    
    // Test 4: Verifică listAgentsByDomain
    this.tests.push({
      name: "List agents by domain",
      test: () => {
        const scientists = listAgentsByDomain("science");
        return scientists.length > 0;
      }
    });
    
    // Test 5: Verifică searchAgentsByName
    this.tests.push({
      name: "Search agents by name",
      test: () => {
        const results = searchAgentsByName("Einstein");
        return results.length > 0 && results[0].name.includes("Einstein");
      }
    });
    
    // Test 6: Verifică getTopAgents
    this.tests.push({
      name: "Get top agents",
      test: () => {
        const topAgents = getTopAgents(5);
        return topAgents.length === 5 && topAgents[0].rank === 1;
      }
    });
    
    // Test 7: Verifică getAgentsStats
    this.tests.push({
      name: "Get agents stats",
      test: () => {
        const stats = getAgentsStats();
        return stats.total === 100 && stats.domains.length > 0;
      }
    });
    
    // Test 8: Verifică agentExists
    this.tests.push({
      name: "Agent exists",
      test: () => {
        return agentExists("hart-001-muhammad") && !agentExists("non-existent");
      }
    });
    
    // Test 9: Verifică rankExists
    this.tests.push({
      name: "Rank exists",
      test: () => {
        return rankExists(1) && rankExists(100) && !rankExists(101);
      }
    });
    
    // Test 10: Verifică structura datelor
    this.tests.push({
      name: "Data structure validation",
      test: () => {
        const agents = listAgents();
        const firstAgent = agents[0];
        
        return (
          firstAgent.id !== undefined &&
          firstAgent.name !== undefined &&
          firstAgent.rank !== undefined &&
          firstAgent.categories !== undefined &&
          firstAgent.persona !== undefined &&
          firstAgent.knowledge_profile !== undefined &&
          firstAgent.limitations !== undefined &&
          firstAgent.prompt_template !== undefined
        );
      }
    });
  }
  
  /**
   * Rulează toate testele
   */
  runAllTests(): { passed: number; failed: number; results: string[] } {
    const results: string[] = [];
    let passed = 0;
    let failed = 0;
    
    console.log("🧪 Running Great Humans SDK Tests");
    console.log("=".repeat(50));
    
    for (const test of this.tests) {
      try {
        const result = test.test();
        if (result) {
          passed++;
          results.push(`✅ ${test.name}`);
          console.log(`✅ ${test.name}`);
        } else {
          failed++;
          results.push(`❌ ${test.name}`);
          console.log(`❌ ${test.name}`);
        }
      } catch (error) {
        failed++;
        results.push(`❌ ${test.name} - Error: ${error}`);
        console.log(`❌ ${test.name} - Error: ${error}`);
      }
    }
    
    console.log("=".repeat(50));
    console.log(`📊 Results: ${passed} passed, ${failed} failed`);
    
    return { passed, failed, results };
  }
  
  /**
   * Rulează un singur test
   */
  runTest(testName: string): boolean {
    const test = this.tests.find(t => t.name === testName);
    if (!test) {
      console.log(`❌ Test "${testName}" not found`);
      return false;
    }
    
    try {
      const result = test.test();
      console.log(`${result ? '✅' : '❌'} ${test.name}`);
      return result;
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error}`);
      return false;
    }
  }
  
  /**
   * Listează toate testele disponibile
   */
  listTests(): string[] {
    return this.tests.map(t => t.name);
  }
}

/**
 * Funcție helper pentru a rula testele rapid
 */
export function runTests(): boolean {
  const testSuite = new GreatHumansTestSuite();
  const results = testSuite.runAllTests();
  return results.failed === 0;
}

/**
 * Funcție helper pentru a rula un test specific
 */
export function runTest(testName: string): boolean {
  const testSuite = new GreatHumansTestSuite();
  return testSuite.runTest(testName);
}

// Export default
export default GreatHumansTestSuite;
