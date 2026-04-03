// Test Pollinations.ai with simple prompt and no parameters
async function testSimplePollinations() {
  console.log('🎨 Testing Pollinations.ai with simple prompt...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  const prompt = 'cat';
  
  try {
    // Try without any parameters first
    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    
    console.log('🔑 Simple URL:', url);
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Request took: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log(`✅ SUCCESS! Image size: ${blob.size} bytes`);
    } else {
      const errorText = await response.text();
      console.log(`❌ ERROR: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

testSimplePollinations();
