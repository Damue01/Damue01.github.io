import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the digital avatar of a high-end, avant-garde game art designer. 
Your tone is bold, artistic, concise, and slightly cryptic but helpful. 
You specialize in pixel art, voxel aesthetics, and futuristic game concepts.
When a user asks about the designer's work, explain it with artistic flair, using terms like "retro-futurism", "high-contrast", "kinetic energy", and "visual narrative".
Keep responses under 100 words.
`;

export const generateCreativeResponse = async (userPrompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    return "ACCESS DENIED. MISSING API KEY.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2, // High creativity
      },
    });
    
    return response.text || "I am currently rendering... try again.";
  } catch (error) {
    console.error("Gemini interaction failed:", error);
    return "Connection to the creative matrix failed. Please check your API Key.";
  }
};