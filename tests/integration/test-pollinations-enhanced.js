// Test Enhanced Pollinations.ai API with API key
async function testPollinationsEnhanced() {
  console.log('🎨 Testing Enhanced Pollinations.ai with API key...');
  
  const API_KEY = 'sk_dzADJ1OgihZLQCk9OkMEHAHyT1WCQPkx';
  const BASE_URL = 'https://api.pollinations.ai';
  
  try {
    // Test image generation with API key
    console.log('\n🖼️ Testing Image Generation...');
    const imagePrompt = 'Historical portrait of Albert Einstein, theoretical physicist from 20th century. Style: realistic historical painting, artistic, detailed.';
    
    const imageUrl = `${BASE_URL}/generate/image?apikey=${API_KEY}&prompt=${encodeURIComponent(imagePrompt)}&model=flux&width=512&height=512&nologo=true&enhance=true`;
    
    console.log('Image URL:', imageUrl);
    
    const startTime = Date.now();
    const imageResponse = await fetch(imageUrl, {
      signal: AbortSignal.timeout(60000)
    });
    
    const endTime = Date.now();
    const imageDuration = endTime - startTime;
    
    console.log(`⏱️ Image generation took: ${imageDuration}ms`);
    console.log(`📊 Image Status: ${imageResponse.status} ${imageResponse.statusText}`);
    
    if (imageResponse.ok) {
      const imageBlob = await imageResponse.blob();
      console.log(`✅ Image SUCCESS! Size: ${imageBlob.size} bytes`);
    } else {
      const errorText = await imageResponse.text();
      console.log(`❌ Image ERROR: ${errorText}`);
    }

    // Test text generation
    console.log('\n📝 Testing Text Generation...');
    const textPrompt = 'As Albert Einstein, explain relativity in simple terms.';
    
    const textUrl = `${BASE_URL}/generate/text?apikey=${API_KEY}&prompt=${encodeURIComponent(textPrompt)}&model=gpt-4o-mini&max_tokens=200`;
    
    console.log('Text URL:', textUrl);
    
    const textStartTime = Date.now();
    const textResponse = await fetch(textUrl, {
      signal: AbortSignal.timeout(60000)
    });
    
    const textEndTime = Date.now();
    const textDuration = textEndTime - textStartTime;
    
    console.log(`⏱️ Text generation took: ${textDuration}ms`);
    console.log(`📊 Text Status: ${textResponse.status} ${textResponse.statusText}`);
    
    if (textResponse.ok) {
      const textData = await textResponse.json();
      console.log(`✅ Text SUCCESS!`);
      console.log(`📄 Response:`, textData.text || textData.content || textData);
    } else {
      const errorText = await textResponse.text();
      console.log(`❌ Text ERROR: ${errorText}`);
    }

    // Test available models
    console.log('\n🔍 Testing Available Models...');
    
    const modelsTypes = ['image', 'text', 'audio', 'video'];
    
    for (const type of modelsTypes) {
      try {
        const modelsUrl = `${BASE_URL}/models/${type}?apikey=${API_KEY}`;
        const modelsResponse = await fetch(modelsUrl);
        
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          console.log(`✅ ${type} models:`, modelsData.models || modelsData);
        } else {
          console.log(`❌ ${type} models failed: ${modelsResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ ${type} models error:`, error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ GENERAL ERROR:', error.message);
  }
}

testPollinationsEnhanced();
