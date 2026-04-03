// Test Pollinations.ai image generation
async function testImageGeneration() {
  console.log('🎨 Testing Pollinations.ai image generation...');
  
  try {
    const testPayload = {
      prompt: 'Historical portrait of Albert Einstein, theoretical physicist from 20th century. Style: realistic historical painting, artistic, detailed, capturing the essence of physics, mathematics, philosophy. Historical accuracy, authentic clothing and setting from 20th century.',
      model: 'flux',
      width: 1024,
      height: 1024,
      nologo: true,
      enhance: true
    };

    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️ Image generation took: ${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ SUCCESS:');
    console.log('Response:', JSON.stringify(data, null, 2));
    
    console.log('\n🖼️ Image URL:');
    console.log(data.imageUrl);
    
  } catch (error) {
    console.log('❌ ERROR:');
    console.log(error.message);
  }
}

async function testImageModels() {
  console.log('\n🔍 Testing available image models...');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-image');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Available models:', data.models);
    
  } catch (error) {
    console.log('❌ ERROR fetching models:', error.message);
  }
}

async function runTests() {
  await testImageModels();
  await testImageGeneration();
}

runTests();
