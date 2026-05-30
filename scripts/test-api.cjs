const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read API key from .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/VITE_AI_API_KEY\s*=\s*(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

async function testModel() {
  const models = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3-flash'];
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: `Hello, respond with "API is working with ${model}"` }] }]
    };

    try {
      const res = await axios.post(url, payload);
      console.log(`Success with ${model}! Response:`, res.data.candidates[0].content.parts[0].text);
      return;
    } catch (err) {
      console.log(`Failed with ${model}! Status:`, err.response ? err.response.status : err.message);
      if (err.response) {
        console.log('Error data:', JSON.stringify(err.response.data));
      }
    }
  }
}

testModel();
