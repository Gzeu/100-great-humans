"use strict";
/**
 * Great Humans TypeScript SDK - Test Suite
 *
 * Teste simple pentru a verifica funcționalitatea SDK-ului
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatHumansTestSuite = void 0;
exports.runTests = runTests;
exports.runTest = runTest;
const agents_1 = require("./agents");
/**
 * Test suite pentru Great Humans SDK
 */
class GreatHumansTestSuite {
    constructor() {
        this.tests = [];
        this.setupTests();
    }
    setupTests() {
        // Test 1: Verifică încărcarea agenților
        this.tests.push({
            name: "Load agents",
            test: () => {
                const agents = (0, agents_1.listAgents)();
                return agents.length === 100;
            }
        });
        // Test 2: Verifică getAgentById
        this.tests.push({
            name: "Get agent by ID",
            test: () => {
                const muhammad = (0, agents_1.getAgentById)("hart-001-muhammad");
                return muhammad !== undefined && muhammad.name === "Muhammad";
            }
        });
        // Test 3: Verifică getAgentByRank
        this.tests.push({
            name: "Get agent by rank",
            test: () => {
                const newton = (0, agents_1.getAgentByRank)(2);
                return newton !== undefined && newton.name === "Isaac Newton";
            }
        });
        // Test 4: Verifică listAgentsByDomain
        this.tests.push({
            name: "List agents by domain",
            test: () => {
                const scientists = (0, agents_1.listAgentsByDomain)("science");
                return scientists.length > 0;
            }
        });
        // Test 5: Verifică searchAgentsByName
        this.tests.push({
            name: "Search agents by name",
            test: () => {
                const results = (0, agents_1.searchAgentsByName)("Einstein");
                return results.length > 0 && results[0].name.includes("Einstein");
            }
        });
        // Test 6: Verifică getTopAgents
        this.tests.push({
            name: "Get top agents",
            test: () => {
                const topAgents = (0, agents_1.getTopAgents)(5);
                return topAgents.length === 5 && topAgents[0].rank === 1;
            }
        });
        // Test 7: Verifică getAgentsStats
        this.tests.push({
            name: "Get agents stats",
            test: () => {
                const stats = (0, agents_1.getAgentsStats)();
                return stats.total === 100 && stats.domains.length > 0;
            }
        });
        // Test 8: Verifică agentExists
        this.tests.push({
            name: "Agent exists",
            test: () => {
                return (0, agents_1.agentExists)("hart-001-muhammad") && !(0, agents_1.agentExists)("non-existent");
            }
        });
        // Test 9: Verifică rankExists
        this.tests.push({
            name: "Rank exists",
            test: () => {
                return (0, agents_1.rankExists)(1) && (0, agents_1.rankExists)(100) && !(0, agents_1.rankExists)(101);
            }
        });
        // Test 10: Verifică structura datelor
        this.tests.push({
            name: "Data structure validation",
            test: () => {
                const agents = (0, agents_1.listAgents)();
                const firstAgent = agents[0];
                return (firstAgent.id !== undefined &&
                    firstAgent.name !== undefined &&
                    firstAgent.rank !== undefined &&
                    firstAgent.categories !== undefined &&
                    firstAgent.persona !== undefined &&
                    firstAgent.knowledge_profile !== undefined &&
                    firstAgent.limitations !== undefined &&
                    firstAgent.prompt_template !== undefined);
            }
        });
    }
    /**
     * Rulează toate testele
     */
    runAllTests() {
        const results = [];
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
                }
                else {
                    failed++;
                    results.push(`❌ ${test.name}`);
                    console.log(`❌ ${test.name}`);
                }
            }
            catch (error) {
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
    runTest(testName) {
        const test = this.tests.find(t => t.name === testName);
        if (!test) {
            console.log(`❌ Test "${testName}" not found`);
            return false;
        }
        try {
            const result = test.test();
            console.log(`${result ? '✅' : '❌'} ${test.name}`);
            return result;
        }
        catch (error) {
            console.log(`❌ ${test.name} - Error: ${error}`);
            return false;
        }
    }
    /**
     * Listează toate testele disponibile
     */
    listTests() {
        return this.tests.map(t => t.name);
    }
}
exports.GreatHumansTestSuite = GreatHumansTestSuite;
/**
 * Funcție helper pentru a rula testele rapid
 */
function runTests() {
    const testSuite = new GreatHumansTestSuite();
    const results = testSuite.runAllTests();
    return results.failed === 0;
}
/**
 * Funcție helper pentru a rula un test specific
 */
function runTest(testName) {
    const testSuite = new GreatHumansTestSuite();
    return testSuite.runTest(testName);
}
// Export default
exports.default = GreatHumansTestSuite;
//# sourceMappingURL=test.js.map