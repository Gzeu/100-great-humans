// Test Pollinations.ai only (no Puter.js)
async function testPollinationsOnly() {
  console.log('🎨 Testing Pollinations.ai only...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  const prompt = 'Karl Marx in the British Museum reading room, historical portrait';
  
  try {
    // Test the correct gen.pollinations.ai endpoint
    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&width=512&height=512&enhance=true`;
    
    console.log('🔑 Testing URL:', url);
    console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...');
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'image/*',
        'User-Agent': '100-Great-Humans/1.0'
      },
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
      console.log(`🎨 Data URL: ${dataUrl.substring(0, 50)}...`);
      
      // Test in browser
      if (typeof window !== 'undefined') {
        const img = new Image();
        img.onload = () => {
          console.log('✅ Image loaded successfully!');
          document.body.appendChild(img);
        };
        img.src = dataUrl;
      }
      
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

// Auto-run
testPollinationsOnly();
