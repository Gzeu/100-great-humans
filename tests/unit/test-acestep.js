// Test ACE-Step free music generation
async function testACEStep() {
  console.log('🎵 Testing ACE-Step free music generation...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'audio',
        prompt: 'gentle piano melody',
        model: 'acestep',
        agent: {
          name: 'Music Composer',
          persona: { archetype: 'Composer' },
          categories: { domains: ['music'] },
          knowledge_profile: { era: 'Contemporary' }
        }
      })
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ACE-Step Result:', {
        success: data.success,
        model: data.model,
        url: data.url ? (data.url.length > 50 ? data.url.substring(0, 50) + '...' : data.url) : 'none',
        error: data.error || 'none'
      });
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
  
  // Test direct ACE-Step endpoint
  console.log('\n📋 Testing direct ACE-Step endpoint...');
  
  try {
    const response = await fetch(`https://gen.pollinations.ai/audio/gentle%20piano%20melody?model=acestep&key=${API_KEY}`, {
      headers: {
        'User-Agent': '100-Great-Humans/1.0'
      }
    });
    
    console.log(`📊 Direct Status: ${response.status}`);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log(`✅ Direct Success: Blob size ${blob.size}, type: ${blob.type}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Direct Error: ${errorText.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log('❌ Direct FETCH ERROR:', error.message);
  }
}

testACEStep();
