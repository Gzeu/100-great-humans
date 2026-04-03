# Test Suite - 100 Great Humans Project

This directory contains organized test files for the 100 Great Humans project, providing comprehensive testing for all AI generation features.

## 📁 Test Structure

```
tests/
├── api/                    # API endpoint tests
│   ├── test-api.js
│   ├── test-simple-api.js
│   └── run-api-tests.js
├── integration/           # Full workflow tests
│   ├── test-summary.js
│   ├── test-pollinations-enhanced.js
│   └── run-integration-tests.js
├── unit/                   # Individual feature tests
│   ├── test-audio.js
│   ├── test-image.js
│   ├── test-video.js
│   └── run-unit-tests.js
├── debug/                  # Debug and troubleshooting tests
│   ├── test-debug-*.js
│   └── run-debug-tests.js
├── run-tests.js           # Main test runner
└── package.json           # Test configuration
```

## 🚀 Running Tests

### All Tests
```bash
npm run test
# or
node tests/run-tests.js
```

### Specific Categories
```bash
# API tests only
npm run test:api

# Integration tests only  
npm run test:integration

# Unit tests only
npm run test:unit

# Debug tests only
npm run test:debug
```

## 📋 Test Categories

### 🔌 API Tests
- Test API endpoints directly
- Verify request/response formats
- Test authentication and headers
- Files: `test-api.js`, `test-simple-api.js`

### 🔗 Integration Tests  
- Test complete user workflows
- Multi-modal generation tests
- End-to-end functionality
- Files: `test-summary.js`, `test-pollinations-enhanced.js`

### 🧪 Unit Tests
- Individual feature testing
- Specific generation types
- Isolated functionality
- Files: `test-audio.js`, `test-image.js`, `test-video.js`

### 🐛 Debug Tests
- Troubleshooting utilities
- Service status checks
- Performance monitoring
- Files: `test-debug-*.js`

## 🎯 Key Test Features

### Multi-Modal Testing
- ✅ Text generation
- ✅ Image generation  
- ✅ Audio generation
- ✅ Video generation

### API Coverage
- ✅ Pollinations.ai integration
- ✅ Authentication handling
- ✅ Error management
- ✅ Performance monitoring

### Historical Figure Integration
- ✅ Agent persona testing
- ✅ Knowledge profile validation
- ✅ Era-specific generation
- ✅ Domain categorization

## 📊 Test Results

Tests provide detailed output including:
- ✅ Success/failure status
- ⏱️ Response times
- 📊 Model information
- 🎨 Generated content URLs
- ❌ Error details (if any)

## 🔧 Configuration

### Environment Setup
Ensure your `.env.local` contains:
```
POLLINATIONS_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Server Requirements
- Development server running on `http://localhost:3000`
- Valid Pollinations.ai API key for paid features
- Network access for external API calls

## 📝 Adding New Tests

1. Create test file in appropriate category directory
2. Follow naming convention: `test-[feature].js`
3. Use async/await pattern for API calls
4. Include clear console output with emojis
5. Add error handling with try/catch blocks

### Test Template
```javascript
// Test [Feature Name]
async function test[FeatureName]() {
  console.log('🎯 Testing [Feature]...');
  
  try {
    // Your test logic here
    console.log('✅ [Feature] SUCCESS');
  } catch (error) {
    console.log('❌ [Feature] ERROR:', error.message);
  }
}

test[FeatureName]();
```

## 🚨 Troubleshooting

### Common Issues
1. **Server not running**: Start development server first
2. **API key issues**: Check `.env.local` configuration
3. **Network timeouts**: Increase timeout values in tests
4. **Rate limits**: Wait between API calls

### Debug Mode
Run debug tests for detailed diagnostics:
```bash
npm run test:debug
```

## 📈 Performance Metrics

Tests track:
- Response times (ms)
- Success rates (%)
- Error frequencies
- Model performance

## 🎉 Success Criteria

System is ready when:
- ✅ Text generation works
- ✅ Image generation works  
- ✅ API endpoints respond correctly
- ✅ Error handling functions properly
- ⚠️ Audio/Video may require paid subscription

---

*Last updated: April 2026*
