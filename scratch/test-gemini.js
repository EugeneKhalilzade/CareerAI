require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  console.log("Testing API Key:", apiKey ? "Found" : "Missing");
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message);
    try {
      console.log("Trying gemini-pro...");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Say hello");
      console.log("Response (gemini-pro):", result.response.text());
    } catch (error2) {
      console.error("Error with gemini-pro:", error2.message);
    }
  }
}

testKey();
