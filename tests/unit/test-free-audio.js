// Test audio with different free models
async function testFreeAudio() {
  console.log('🎵 Testing free audio models...');
  
  const audioModels = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  
  for (const model of audioModels) {
    console.log(`\n📋 Testing audio model: ${model}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/pollinations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'audio',
          prompt: 'hello world',
          model: model,
          agent: {
            name: 'Voice Test',
            persona: { archetype: 'Test' },
            categories: { domains: ['audio'] },
            knowledge_profile: { era: 'Contemporary' }
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${model}:`, {
          success: data.success,
          error: data.error || 'none'
        });
      } else {
        console.log(`❌ ${model}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${model}:`, error.message);
    }
  }
}

testFreeAudio();
