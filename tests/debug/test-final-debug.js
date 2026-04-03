// Final debug test
async function finalDebug() {
  console.log('🔍 Final debug test...');
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'text',
        prompt: 'simple hello',
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
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

finalDebug();
