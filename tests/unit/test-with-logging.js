// Test with detailed logging
async function testWithLogging() {
  console.log('🔍 Testing with detailed logging...');
  
  try {
    // Test text generation which should work better
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'text',
        prompt: 'Hello world',
        agent: {
          name: 'Test Agent',
          persona: { archetype: 'Test' },
          categories: { domains: [] },
          knowledge_profile: { era: 'Test' }
        }
      })
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response:', data);
      
      if (data.success) {
        console.log('📝 Text generated:', data.url);
      } else {
        console.log('❌ Generation failed:', data.error);
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
    console.log('❌ Stack:', error.stack);
  }
}

testWithLogging();
