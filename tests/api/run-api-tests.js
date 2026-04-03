// API Tests Runner
const fs = require('fs');
const path = require('path');

async function runApiTests() {
  console.log('🔌 Running API Tests');
  console.log('-'.repeat(30));
  
  const testDir = path.join(__dirname);
  const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.js') && file !== 'run-api-tests.js');
  
  for (const file of testFiles) {
    console.log(`\n📄 Running ${file}...`);
    try {
      require(path.join(testDir, file));
      // Give async tests time to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log(`❌ ${file} failed: ${error.message}`);
    }
  }
}

runApiTests().catch(console.error);
