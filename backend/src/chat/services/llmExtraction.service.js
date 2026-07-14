import ai from "../config/aiClient.js";
import { shopNameExtractionPrompt } from "../prompts/shopNameExtractionPrompt.js";

export const extractShopAndDateIntent = async (userMessage) => {
  const llmResponse = await ai.generateContent({
    model: "gemini-flash-latest",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
${shopNameExtractionPrompt}

Return JSON only.
Do NOT explain.
Do NOT use markdown.

Expected format:
{
  "shop_name": string | null,
  "chrono_query": string | null
}

User Query:
${userMessage}
`,
          },
        ],
      },
    ],
  });

  const rawText =
    llmResponse.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Invalid JSON from Gemini");
  }
};
