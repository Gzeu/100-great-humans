// Test fixed Pollinations.ai implementation
async function testFixedPollinations() {
  console.log('🎨 Testing fixed Pollinations.ai implementation...');
  
  try {
    // Test our API route
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'image',
        prompt: 'Karl Marx in the British Museum reading room',
        agent: {
          name: 'Karl Marx',
          persona: { archetype: 'Historical Figure' },
          categories: { domains: [] },
          knowledge_profile: { era: 'Historical' }
        }
      })
    });

    console.log(`📊 API Route Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Response:', data);
    } else {
      const errorText = await response.text();
      console.log(`❌ ERROR: ${errorText}`);
      
      // Try to parse error
      try {
        const errorData = JSON.parse(errorText);
        console.log('📋 Error details:', errorData);
      } catch (e) {
        console.log('📋 Raw error text:', errorText);
      }
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

// Also test direct pollinations endpoints
async function testDirectEndpoints() {
  console.log('\n🔍 Testing direct Pollinations endpoints...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  
  try {
    // Test image generation with API key as query parameter
    const imageResponse = await fetch(`https://gen.pollinations.ai/image/cat?key=${API_KEY}`, {
      signal: AbortSignal.timeout(20000)
    });
    
    console.log(`📊 Direct Image Status: ${imageResponse.status}`);
    
    if (imageResponse.ok) {
      console.log('✅ Direct image generation works!');
    } else {
      const errorText = await imageResponse.text();
      console.log(`❌ Direct image error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ Direct test error:', error.message);
  }
}

// Run tests
testFixedPollinations();
testDirectEndpoints();
