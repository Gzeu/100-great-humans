// Test all new Pollinations features
async function testNewFeatures() {
  console.log('🚀 Testing New Pollinations Features');
  console.log('=====================================\n');
  
  const baseUrl = 'http://localhost:3000/api/pollinations/generate';
  
  const tests = [
    {
      name: 'Seamless Texture Generation',
      type: 'texture',
      prompt: 'medieval castle wall stone pattern',
      expected: 'Should work with Flux Schnell'
    },
    {
      name: 'Open Graph Card Generation',
      type: 'og-card',
      prompt: '100 Great Humans - Historical Figures AI',
      expected: 'Should generate 1200x630 social card'
    },
    {
      name: 'Scientific Visualization',
      type: 'scientific',
      prompt: 'quantum entanglement',
      options: { style: 'quantum', detail: 'detailed' },
      expected: 'Should work with Qwen Image Plus'
    },
    {
      name: 'Educational Content',
      type: 'educational',
      prompt: 'Renaissance art',
      options: { level: 'high', format: 'explanation' },
      expected: 'Should work with Claude Haiku'
    },
    {
      name: 'Music Generation (ACE-Step)',
      type: 'music',
      prompt: 'epic historical battle music',
      options: { duration: 20, style: 'orchestral', tempo: 'fast' },
      expected: 'Should work with ACE-Step 1.5 Turbo'
    },
    {
      name: 'MIDI Generation',
      type: 'midi',
      prompt: 'classical piano sonata',
      options: { duration: 30, genre: 'classical', complexity: 'moderate' },
      expected: 'Should work with Midijourney'
    },
    {
      name: 'Advanced Reasoning',
      type: 'reasoning',
      prompt: 'Explain the impact of Leonardo da Vinci on modern technology',
      expected: 'Should work with Grok Reasoning (2M context)'
    },
    {
      name: 'Multi-Modal Generation',
      type: 'multimodal',
      prompt: 'Albert Einstein explaining relativity',
      options: { 
        includeImage: true, 
        includeAudio: true, 
        includeText: true,
        imageOptions: { model: 'flux' },
        audioOptions: { model: 'ace-step-1.5-turbo' },
        textOptions: { model: 'claude-haiku' }
      },
      expected: 'Should generate all three modalities'
    }
  ];
  
  let workingCount = 0;
  let totalCount = tests.length;
  
  for (const test of tests) {
    console.log(`🧪 ${test.name}`);
    console.log(`📝 Prompt: "${test.prompt}"`);
    console.log(`🎯 Expected: ${test.expected}`);
    
    try {
      const requestBody = {
        type: test.type,
        prompt: test.prompt,
        agent: {
          name: 'Test Agent',
          persona: { archetype: 'Historical Expert' },
          categories: { domains: ['history', 'education'] },
          knowledge_profile: { era: 'Renaissance to Modern' }
        },
        ...test.options
      };
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const data = await response.json();
        const status = data.success ? '✅ WORKING' : '❌ FAILED';
        console.log(`   Status: ${status}`);
        
        if (data.success) {
          console.log(`   Model: ${data.model}`);
          console.log(`   Type: ${data.type}`);
          
          // Special handling for multi-modal
          if (test.type === 'multimodal' && data.image && data.audio && data.text) {
            console.log(`   Multi-modal: ✅ Image, Audio, Text all generated`);
            workingCount++;
          } else if (test.type !== 'multimodal' && data.url) {
            console.log(`   URL: ${data.url.substring(0, 100)}...`);
            workingCount++;
          } else {
            console.log(`   Error: Missing expected output`);
          }
        } else {
          console.log(`   Error: ${data.error}`);
        }
      } else {
        console.log(`   Status: ❌ HTTP ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   Status: ❌ FETCH ERROR: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('=====================================');
  console.log(`🎯 NEW FEATURES RESULT: ${workingCount}/${totalCount} features working`);
  console.log(`📊 Success Rate: ${Math.round((workingCount/totalCount) * 100)}%`);
  console.log('');
  
  if (workingCount >= 6) {
    console.log('✅ NEW FEATURES ARE READY!');
    console.log('🎨 Most advanced Pollinations features are working');
    console.log('🚀 System supports latest AI capabilities');
  } else {
    console.log('❌ Some new features need work');
  }
}

// Test new models availability
async function testNewModels() {
  console.log('\n🤖 Testing New Model Availability');
  console.log('=====================================\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/pollinations/generate?feature=new');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ New Features API Working');
      console.log('📋 Available Features:');
      
      data.features?.forEach((feature, index) => {
        console.log(`   ${index + 1}. ${feature.name} (${feature.id})`);
        console.log(`      ${feature.description}`);
        console.log(`      Type: ${feature.type}`);
      });
      
      console.log('\n🔧 New Models by Category:');
      Object.entries(data.newModels || {}).forEach(([category, models]) => {
        console.log(`   ${category.toUpperCase()}: ${models.join(', ')}`);
      });
    } else {
      console.log('❌ New Features API not working');
    }
  } catch (error) {
    console.log(`❌ Error testing new models: ${error.message}`);
  }
}

// Run all tests
async function runAllNewTests() {
  await testNewFeatures();
  await testNewModels();
}

runAllNewTests();
