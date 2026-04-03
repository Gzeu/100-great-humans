// Test free models directly
async function testFreeDirect() {
  console.log('🎨 Testing free models directly...');
  
  try {
    // Test text without API key
    const textResponse = await fetch('https://gen.pollinations.ai/text/hello%20world?model=mistral', {
      signal: AbortSignal.timeout(15000)
    });
    
    console.log(`📊 Text (no API key): ${textResponse.status}`);
    
    if (textResponse.ok) {
      const text = await textResponse.text();
      console.log('✅ Free text generation works:', text.substring(0, 100));
    } else {
      const errorText = await textResponse.text();
      console.log(`❌ Text error: ${errorText}`);
    }
    
    // Test image without API key
    const imageResponse = await fetch('https://gen.pollinations.ai/image/cat?model=flux', {
      signal: AbortSignal.timeout(15000)
    });
    
    console.log(`📊 Image (no API key): ${imageResponse.status}`);
    
    if (imageResponse.ok) {
      const blob = await imageResponse.blob();
      console.log('✅ Free image generation works, size:', blob.size);
    } else {
      const errorText = await imageResponse.text();
      console.log(`❌ Image error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testFreeDirect();
