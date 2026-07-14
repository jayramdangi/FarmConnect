// config/aiClient.js
import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
 

const ai = {
  generateContent: async ({ model, contents }) => {
    const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return res.json();
  },
};

 async function listModels () {
    // Note: 'list' doesn't use the 'models/' suffix in the URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.models) {
      console.log("--- AVAILABLE MODELS ---");
      data.models.forEach(m => {
        // We filter for models that support generating content
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`Model ID: ${m.name.split('/')[1]} (${m.displayName})`);
        }
      });
      console.log("-------------------------");
    } else {
      console.error("Could not fetch models. Check if your API key is correct.", data);
    }
  }

export default ai;
