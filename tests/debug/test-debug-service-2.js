// Debug PollinationsEnhancedService directly
import { pollinationsEnhancedService } from './lib/pollinations-enhanced.js';

async function debugService() {
  console.log('🔍 Debugging PollinationsEnhancedService...');
  
  try {
    const result = await pollinationsEnhancedService.generateImage({
      prompt: 'cat',
      model: 'flux',
      width: 512,
      height: 512
    });
    
    console.log('✅ Service Result:', result);
    
    if (result.success) {
      console.log('🎨 Image URL:', result.url);
    } else {
      console.log('❌ Service Error:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Service Exception:', error.message);
    console.log('❌ Stack:', error.stack);
  }
}

debugService();
