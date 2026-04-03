// Test direct Pollinations audio endpoints
async function testAudioEndpoints() {
  console.log('🎵 Testing direct audio endpoints...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  
  const endpoints = [
    'https://gen.pollinations.ai/audio/hello',
    'https://gen.pollinations.ai/audio/hello?model=tts-1',
    `https://gen.pollinations.ai/audio/hello?key=${API_KEY}`,
    `https://gen.pollinations.ai/audio/hello?model=tts-1&key=${API_KEY}`
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📋 Testing: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        headers: {
          'User-Agent': '100-Great-Humans/1.0'
        }
      });
      
      console.log(`📊 Status: ${response.status}`);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log(`✅ Success: Blob size ${blob.size}, type: ${blob.type}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Error: ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ FETCH ERROR:`, error.message);
    }
  }
}

testAudioEndpoints();
