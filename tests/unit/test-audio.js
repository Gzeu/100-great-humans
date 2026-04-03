// Test audio generation
async function testAudio() {
  console.log('🎵 Testing audio generation...');
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'audio',
        prompt: 'gentle piano melody',
        agent: {
          name: 'Music Composer',
          persona: { archetype: 'Composer' },
          categories: { domains: ['music', 'audio'] },
          knowledge_profile: { era: 'Contemporary' }
        }
      })
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Audio Response:', {
        url: data.url?.substring(0, 100) + '...',
        type: data.type,
        model: data.model,
        success: data.success
      });
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

testAudio();
