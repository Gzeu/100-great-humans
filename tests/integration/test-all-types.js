// Test all content types with detailed logging
async function testAllTypes() {
  console.log('🚀 Testing all content types...');
  
  const tests = [
    {
      name: 'Text',
      type: 'text',
      prompt: 'hello world',
      agent: { name: 'Test Agent', persona: { archetype: 'Test' }, categories: { domains: [] }, knowledge_profile: { era: 'Test' } }
    },
    {
      name: 'Image',
      type: 'image',
      prompt: 'a simple cat',
      agent: { name: 'Artist', persona: { archetype: 'Artist' }, categories: { domains: ['art'] }, knowledge_profile: { era: 'Contemporary' } }
    },
    {
      name: 'Audio',
      type: 'audio',
      prompt: 'hello',
      agent: { name: 'Voice Actor', persona: { archetype: 'Actor' }, categories: { domains: ['audio'] }, knowledge_profile: { era: 'Contemporary' } }
    },
    {
      name: 'Video',
      type: 'video',
      prompt: 'a simple animation',
      agent: { name: 'Animator', persona: { archetype: 'Artist' }, categories: { domains: ['video'] }, knowledge_profile: { era: 'Contemporary' } }
    }
  ];

  for (const test of tests) {
    console.log(`\n📋 Testing ${test.name} Generation...`);
    
    try {
      const response = await fetch('http://localhost:3000/api/pollinations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test)
      });

      console.log(`📊 ${test.name} Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name} Result:`, {
          success: data.success,
          model: data.model,
          url: data.url ? (data.url.length > 50 ? data.url.substring(0, 50) + '...' : data.url) : 'none',
          error: data.error || 'none'
        });
      } else {
        const errorText = await response.text();
        console.log(`❌ ${test.name} Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} FETCH ERROR:`, error.message);
    }
  }
  
  console.log('\n🎯 Test Complete!');
}

testAllTypes();
