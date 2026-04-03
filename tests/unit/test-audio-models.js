// Check available audio models
async function checkAudioModels() {
  console.log('🎵 Checking available audio models...');
  
  try {
    const response = await fetch('https://gen.pollinations.ai/audio/models', {
      headers: {
        'User-Agent': '100-Great-Humans/1.0'
      }
    });
    
    console.log(`📊 Models Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available Models:', data);
      
      if (Array.isArray(data)) {
        console.log('\n📋 Model Details:');
        data.forEach((model, index) => {
          console.log(`${index + 1}. ${model}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

checkAudioModels();
