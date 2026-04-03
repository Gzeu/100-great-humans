// Test image generation
async function testImage() {
  console.log('🎨 Testing image generation...');
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'image',
        prompt: 'a beautiful sunset over mountains',
        agent: {
          name: 'Nature Artist',
          persona: { archetype: 'Artist' },
          categories: { domains: ['art', 'nature'] },
          knowledge_profile: { era: 'Contemporary' }
        }
      })
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Image Response:', {
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

testImage();
