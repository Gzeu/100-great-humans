// Test API route with simple prompt
async function testSimpleAPI() {
  console.log('🎨 Testing API route with simple prompt...');
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'image',
        prompt: 'cat',
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
      
      if (data.success && data.url) {
        console.log('🎨 Image URL:', data.url);
      } else {
        console.log('❌ Generation failed:', data.error);
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

testSimpleAPI();
