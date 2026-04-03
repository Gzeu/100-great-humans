// Test Pollinations.ai with API key
async function testPollinationsWithKey() {
  console.log('🎨 Testing Pollinations.ai with API key...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  const prompt = 'cat';
  
  try {
    // Test with API key via query parameter
    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?key=${API_KEY}`;
    
    console.log('🔑 URL with API key:', url);
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(30000)
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Request took: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log(`✅ SUCCESS! Image size: ${blob.size} bytes`);
      console.log(`🖼️ Content-Type: ${blob.type}`);
      
      // Create data URL for display
      const dataUrl = URL.createObjectURL(blob);
      console.log(`🎨 Image ready: ${dataUrl.substring(0, 50)}...`);
      
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

testPollinationsWithKey();
