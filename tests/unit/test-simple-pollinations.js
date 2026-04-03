// Test simple Pollinations.ai image generation with API key
async function testSimplePollinations() {
  console.log('🎨 Testing simple Pollinations.ai image generation...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  const prompt = 'Karl Marx in the British Museum reading room, historical portrait, realistic painting';
  
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?apikey=${API_KEY}&width=512&height=512&nologo=true&enhance=true`;
    
    console.log('URL:', url);
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      signal: AbortSignal.timeout(60000)
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Request took: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log(`✅ SUCCESS! Image size: ${blob.size} bytes`);
      console.log(`🖼️ Image URL: ${url}`);
      
      // Test if we can display it
      const dataUrl = URL.createObjectURL(blob);
      console.log(`🎨 Data URL created: ${dataUrl.substring(0, 50)}...`);
      
    } else {
      const errorText = await response.text();
      console.log(`❌ ERROR: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

testSimplePollinations();
