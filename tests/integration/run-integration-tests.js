// Integration Tests Runner
const fs = require('fs');
const path = require('path');

async function runIntegrationTests() {
  console.log('🔗 Running Integration Tests');
  console.log('-'.repeat(35));
  
  const testDir = path.join(__dirname);
  const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.js') && file !== 'run-integration-tests.js');
  
  for (const file of testFiles) {
    console.log(`\n📄 Running ${file}...`);
    try {
      require(path.join(testDir, file));
      // Give integration tests more time
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.log(`❌ ${file} failed: ${error.message}`);
    }
  }
}

runIntegrationTests().catch(console.error);
