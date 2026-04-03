// Debug URL construction
async function debugURL() {
  console.log('🔍 Debugging URL construction...');
  
  try {
    // Simulate what our service does
    const prompt = 'hello world';
    const model = 'mistral';
    const temperature = 0.7;
    
    const endpoint = `https://gen.pollinations.ai/text/${encodeURIComponent(prompt)}`;
    console.log('📍 Endpoint:', endpoint);
    
    const params = {
      model: model,
      temperature: temperature
    };
    
    const url = new URL(endpoint);
    console.log('📍 URL before params:', url.toString());
    
    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'prompt') {
        url.searchParams.append(key, String(value));
        console.log(`➕ Adding param: ${key} = ${value}`);
      }
    });
    
    console.log('📍 Final URL:', url.toString());
    
    const headers = {
      'Accept': 'text/plain',
      'User-Agent': '100-Great-Humans/1.0'
    };
    
    console.log('📋 Headers:', headers);
    
    const response = await fetch(url.toString(), { headers });
    console.log('📊 Response:', response.status);
    
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Success:', text.substring(0, 100));
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugURL();
