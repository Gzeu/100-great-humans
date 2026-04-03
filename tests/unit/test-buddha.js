// Test Buddha chat specifically
const testPayload = {
  model: 'llama-free',
  messages: [
    {
      role: 'system',
      content: 'You are Gautama Buddha, a contemplative spiritual teacher focused on suffering and liberation.'
    },
    {
      role: 'user',
      content: 'salut'
    }
  ],
  temperature: 0.7,
  max_tokens: 200
};

async function testBuddhaChat() {
  console.log('🧪 Testing Buddha chat with llama-free...');
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️ Request took: ${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ SUCCESS:');
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('\n📝 Buddha says:');
      console.log(data.choices[0].message.content);
    } else {
      console.log('❌ Invalid response structure');
    }
    
  } catch (error) {
    console.log('❌ ERROR:');
    console.log(error.message);
  }
}

testBuddhaChat();
