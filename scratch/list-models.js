require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Note: The SDK doesn't have a direct listModels method on the genAI instance in some versions,
    // we might need to use fetch or the official REST endpoint if we want to be sure.
    console.log("Fetching models list...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Available models:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
