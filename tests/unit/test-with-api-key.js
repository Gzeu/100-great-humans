// Test with API key in query parameter
async function testWithAPIKey() {
  console.log('🔍 Testing with API key in query parameter...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  
  try {
    const url = `https://gen.pollinations.ai/text/hello%20world?model=mistral&key=${encodeURIComponent(API_KEY)}`;
    console.log('📍 URL with API key:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': '100-Great-Humans/1.0'
      }
    });
    
    console.log(`📊 Response: ${response.status}`);
    
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Success:', text.substring(0, 100));
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testWithAPIKey();
