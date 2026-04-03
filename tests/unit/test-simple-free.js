// Test simple free generation
async function testSimpleFree() {
  console.log('🎨 Testing simple free generation...');
  
  try {
    // Test direct text generation
    const textResponse = await fetch('https://gen.pollinations.ai/text/hello%20world?model=mistral', {
      headers: {
        'User-Agent': '100-Great-Humans/1.0'
      }
    });
    
    console.log(`📊 Text Status: ${textResponse.status}`);
    
    if (textResponse.ok) {
      const text = await textResponse.text();
      console.log('✅ Text:', text.substring(0, 100));
    } else {
      const errorText = await textResponse.text();
      console.log(`❌ Text Error: ${errorText}`);
    }
    
    // Test direct image generation
    const imageResponse = await fetch('https://gen.pollinations.ai/image/cat?model=flux', {
      headers: {
        'User-Agent': '100-Great-Humans/1.0'
      }
    });
    
    console.log(`📊 Image Status: ${imageResponse.status}`);
    
    if (imageResponse.ok) {
      const blob = await imageResponse.blob();
      console.log('✅ Image size:', blob.size);
    } else {
      const errorText = await imageResponse.text();
      console.log(`❌ Image Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testSimpleFree();
