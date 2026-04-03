// Test Pollinations.ai with Authorization header
async function testAuthHeader() {
  console.log('🔑 Testing Pollinations.ai with Authorization header...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  const prompt = 'Karl Marx in the British Museum reading room, historical portrait, realistic painting';
  
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&enhance=true`;
    
    console.log('URL:', url);
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
        'User-Agent': '100-Great-Humans/1.0',
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Key': API_KEY
      },
      signal: AbortSignal.timeout(60000)
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Request took: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const blob = await response.blob();
      console.log(`✅ SUCCESS! Image size: ${blob.size} bytes`);
      console.log(`🖼️ Content-Type: ${blob.type}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ ERROR: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

testAuthHeader();
