// Debug Tests Runner
const fs = require('fs');
const path = require('path');

async function runDebugTests() {
  console.log('🐛 Running Debug Tests');
  console.log('-'.repeat(27));
  
  const testDir = path.join(__dirname);
  const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.js') && file !== 'run-debug-tests.js');
  
  for (const file of testFiles) {
    console.log(`\n📄 Running ${file}...`);
    try {
      require(path.join(testDir, file));
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log(`❌ ${file} failed: ${error.message}`);
    }
  }
}

runDebugTests().catch(console.error);
