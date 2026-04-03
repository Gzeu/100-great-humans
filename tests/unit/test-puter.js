// Test Puter.js image generation
<!DOCTYPE html>
<html>
<head>
    <title>Puter.js Image Generation Test</title>
    <script src="https://js.puter.com/v2/"></script>
</head>
<body>
    <h1>Puter.js Image Generation Test</h1>
    <div id="results"></div>
    
    <script>
        async function testPuterImageGeneration() {
            const results = document.getElementById('results');
            results.innerHTML = '<p>Testing Puter.js image generation...</p>';
            
            try {
                const prompt = 'Historical portrait of Albert Einstein, theoretical physicist from 20th century. Style: realistic historical painting, artistic, detailed.';
                
                console.log('Testing prompt:', prompt);
                
                const startTime = Date.now();
                
                const imageElement = await puter.ai.txt2img(prompt, {
                    model: 'gpt-image-1.5',
                    quality: 'medium'
                });
                
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                console.log(`✅ Success in ${duration}ms`);
                console.log('Image element:', imageElement);
                
                results.innerHTML = `
                    <h2>✅ Success!</h2>
                    <p>Generation time: ${duration}ms</p>
                    <p>Model: gpt-image-1.5 (medium quality)</p>
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                        <img src="${imageElement.src}" style="max-width: 400px; height: auto;" />
                    </div>
                    <p>Prompt: ${prompt}</p>
                `;
                
            } catch (error) {
                console.error('❌ Error:', error);
                results.innerHTML = `
                    <h2>❌ Error</h2>
                    <p>${error.message}</p>
                `;
            }
        }
        
        // Test after Puter loads
        if (window.puter) {
            testPuterImageGeneration();
        } else {
            document.addEventListener('puter-ready', testPuterImageGeneration);
        }
    </script>
</body>
</html>
