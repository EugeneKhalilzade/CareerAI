require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log("Found models matching 'gemini':");
      data.models.filter(m => m.name.includes('gemini')).forEach(m => {
        console.log(`- ${m.name} (${m.displayName})`);
      });
    } else {
      console.log("No models found or error:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
