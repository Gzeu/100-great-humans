// Test direct Pollinations.ai API
async function testDirectPollinations() {
  console.log('🎨 Testing direct Pollinations.ai API...');
  
  try {
    const prompt = 'Historical portrait of Albert Einstein, theoretical physicist from 20th century. Style: realistic historical painting, artistic, detailed, capturing the essence of physics, mathematics, philosophy. Historical accuracy, authentic clothing and setting from 20th century.';
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=sana&width=512&height=512&nologo=true&enhance=true`;
    
    console.log('URL:', url);
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️ Direct API took: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log('✅ SUCCESS: Image generated successfully!');
    console.log('🖼️ Image URL:', url);
    
    // Save the image to verify
    const buffer = await response.arrayBuffer();
    console.log(`📏 Image size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.log('❌ ERROR:');
    console.log(error.message);
  }
}

async function testSimplePrompt() {
  console.log('\n🎨 Testing simple prompt...');
  
  try {
    const prompt = 'Albert Einstein portrait';
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512`;
    
    console.log('Simple URL:', url);
    
    const response = await fetch(url, {
      signal: AbortSignal.timeout(30000)
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log('✅ Simple prompt SUCCESS!');
      console.log(`📏 Image size: ${buffer.byteLength} bytes`);
    } else {
      const errorText = await response.text();
      console.log('❌ Simple prompt failed:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Simple prompt ERROR:', error.message);
  }
}

async function runTests() {
  await testSimplePrompt();
  await testDirectPollinations();
}

runTests();
