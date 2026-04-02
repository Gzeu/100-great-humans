/**
 * Great Humans TypeScript SDK - Test Suite
 *
 * Teste simple pentru a verifica funcționalitatea SDK-ului
 *
 * @author Great Humans Project
 * @version 1.0.0
 */
/**
 * Test suite pentru Great Humans SDK
 */
export declare class GreatHumansTestSuite {
    private tests;
    constructor();
    private setupTests;
    /**
     * Rulează toate testele
     */
    runAllTests(): {
        passed: number;
        failed: number;
        results: string[];
    };
    /**
     * Rulează un singur test
     */
    runTest(testName: string): boolean;
    /**
     * Listează toate testele disponibile
     */
    listTests(): string[];
}
/**
 * Funcție helper pentru a rula testele rapid
 */
export declare function runTests(): boolean;
/**
 * Funcție helper pentru a rula un test specific
 */
export declare function runTest(testName: string): boolean;
export default GreatHumansTestSuite;
//# sourceMappingURL=test.d.ts.map