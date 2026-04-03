// Debug params being sent
async function debugParams() {
  console.log('🔍 Debugging parameters...');
  
  try {
    // Test direct service call
    const { pollinationsEnhancedService } = await import('./lib/pollinations-enhanced.js');
    
    console.log('🎨 Testing generateText with params...');
    
    const result = await pollinationsEnhancedService.generateText({
      prompt: 'hello world',
      model: 'mistral',
      temperature: 0.7
    });
    
    console.log('✅ Result:', result);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('❌ Stack:', error.stack);
  }
}

debugParams();
