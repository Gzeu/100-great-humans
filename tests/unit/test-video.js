// Test video generation
async function testVideo() {
  console.log('🎬 Testing video generation...');
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'video',
        prompt: 'a peaceful garden with flowers',
        agent: {
          name: 'Video Creator',
          persona: { archetype: 'Filmmaker' },
          categories: { domains: ['video', 'film'] },
          knowledge_profile: { era: 'Contemporary' }
        }
      })
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Video Response:', {
        url: data.url?.substring(0, 100) + '...',
        type: data.type,
        model: data.model,
        success: data.success,
        error: data.error
      });
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

testVideo();
