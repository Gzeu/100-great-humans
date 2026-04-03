// Test script for Literouter API
const models = [
  'llama-free',
  'mistral-free', 
  'qwen2.5-7b-instruct-free',
  'ernie-4.5-21b-a3b-thinking-free'
];

async function testModel(modelId) {
  console.log(`\n🧪 Testing model: ${modelId}`);
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: 'You are Albert Einstein, the famous physicist. Respond as him.'
          },
          {
            role: 'user',
            content: 'Hello, can you explain relativity in simple terms?'
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ ${modelId} SUCCESS:`);
    console.log(data.choices?.[0]?.message?.content || 'No response');
    
  } catch (error) {
    console.log(`❌ ${modelId} ERROR:`);
    console.log(error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...');
  
  for (const model of models) {
    await testModel(model);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
  
  console.log('\n🏁 Tests completed!');
}

runTests();
