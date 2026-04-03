// Test Runner - Orchestrates all test categories
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runAllTests() {
  console.log('🧪 Starting Test Suite for 100 Great Humans Project');
  console.log('=' .repeat(60));
  
  const testCategories = [
    { name: 'API Tests', dir: 'api', script: 'run-api-tests.js' },
    { name: 'Integration Tests', dir: 'integration', script: 'run-integration-tests.js' },
    { name: 'Unit Tests', dir: 'unit', script: 'run-unit-tests.js' },
    { name: 'Debug Tests', dir: 'debug', script: 'run-debug-tests.js' }
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const category of testCategories) {
    console.log(`\n📂 Running ${category.name}...`);
    console.log('-'.repeat(40));
    
    try {
      const scriptPath = path.join(__dirname, category.dir, category.script);
      
      if (fs.existsSync(scriptPath)) {
        const result = execSync(`node "${scriptPath}"`, { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        console.log(result);
        
        // Count passed/failed from output (simplified)
        const lines = result.split('\n');
        const passed = lines.filter(line => line.includes('✅')).length;
        const failed = lines.filter(line => line.includes('❌')).length;
        
        totalPassed += passed;
        totalFailed += failed;
        
        console.log(`✅ ${category.name} completed: ${passed} passed, ${failed} failed`);
      } else {
        console.log(`⚠️  ${category.name}: No test runner found at ${scriptPath}`);
      }
    } catch (error) {
      console.log(`❌ ${category.name} failed: ${error.message}`);
      totalFailed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 FINAL TEST RESULTS');
  console.log('=' .repeat(60));
  console.log(`✅ Total Passed: ${totalPassed}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  console.log(`📊 Success Rate: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All tests passed! System is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the output above.');
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
