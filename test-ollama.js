// Test Ollama Integration
async function testOllama() {
  console.log('🧪 Testing Ollama Integration...');
  
  try {
    // Test 1: Check if Ollama is running
    console.log('📡 Checking Ollama server...');
    const healthResponse = await fetch('http://localhost:11434/api/tags');
    const models = await healthResponse.json();
    console.log('✅ Ollama server is running');
    console.log('📋 Available models:', models.models.map(m => m.name));
    
    // Test 2: Test AI generation
    console.log('\n🤖 Testing Gemma 3 12B model...');
    const testPrompt = 'Explain what 2+2 equals in a simple way.';
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemma3:12b',
        prompt: testPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          num_predict: 100
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ AI Response:', data.response);
    console.log('⚡ Generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testOllama();
