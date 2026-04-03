// Ultra quick Pollinations.ai test
console.log('🔍 Ultra quick test...');

fetch('https://gen.pollinations.ai/v1/models')
  .then(r => console.log(`📊 Models: ${r.status}`))
  .catch(e => console.log('❌ Models error:', e.message));

fetch('https://gen.pollinations.ai/image/cat')
  .then(r => console.log(`📊 Image: ${r.status}`))
  .catch(e => console.log('❌ Image error:', e.message));

console.log('🎯 Test complete!');
