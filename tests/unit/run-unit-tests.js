// Unit Tests Runner
const fs = require('fs');
const path = require('path');

async function runUnitTests() {
  console.log('🧪 Running Unit Tests');
  console.log('-'.repeat(25));
  
  const testDir = path.join(__dirname);
  const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.js') && file !== 'run-unit-tests.js');
  
  for (const file of testFiles) {
    console.log(`\n📄 Running ${file}...`);
    try {
      require(path.join(testDir, file));
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`❌ ${file} failed: ${error.message}`);
    }
  }
}

runUnitTests().catch(console.error);
