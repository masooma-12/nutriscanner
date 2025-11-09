import { GoogleGenAI, Type } from "@google/genai";
import { LUVABLE_SYSTEM_PROMPT } from '../constants';
import { AnalysisResult, ChatMessage } from '../types';
import { findProductByName } from './backendService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
// Using 'gemini-2.5-flash' for both text and vision tasks provides a fast and powerful experience.
const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash';

const nutritionAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING, description: "The name of the product as identified from the packaging (e.g., 'Parle-G Biscuit')." },
    nutrients: {
      type: Type.ARRAY,
      description: "List of key nutrients found on the label.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the nutrient (e.g., 'Calories', 'Total Fat')." },
          value: { type: Type.STRING, description: "Value with units (e.g., '150', '10g')." },
          dv: { type: Type.STRING, description: "Percentage of Daily Value (e.g., '15%'). Use 'N/A' if not present." },
          // The score is crucial for the UI to categorize nutrients.
          score: { type: Type.STRING, description: "A score of 'good', 'moderate', or 'high' based on health impact. 'neutral' for calories. For nutrients to limit (sugar, sodium, sat fat), a low value is 'good'. For beneficial nutrients (fiber, protein), a high value is 'good'." },
        },
        required: ["name", "value", "dv", "score"],
      },
    },
    allergens: {
      type: Type.ARRAY,
      description: "List of potential allergens mentioned.",
      items: { type: Type.STRING },
    },
    summary: {
      type: Type.STRING,
      description: "A single, friendly, encouraging sentence summarizing the product's healthiness in the Luvable persona.",
    },
  },
  required: ["productName", "nutrients", "allergens", "summary"],
};

/**
 * Analyzes a food label image in real-time using Gemini Vision and cross-references with the backend.
 * Step 1: Gemini identifies the product name and nutrients from the image.
 * Step 2: It queries the backend service to check if the product exists in the FSSAI dataset.
 * @param base64Image The base64-encoded string of the food label image.
 * @returns A promise that resolves to the structured analysis result, including a verification flag.
 */
export const analyzeFoodLabel = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    const textPart = {
      text: `Analyze the nutrition label and product packaging in this image. Identify the product name. Extract key nutrients, identify allergens, and provide a friendly one-sentence summary. Follow the provided JSON schema precisely. Classify each nutrient's health impact accurately with the score.`,
    };
    
    // Step 1: Real-time API call to Google's Gemini model for visual analysis.
    const response = await ai.models.generateContent({
      model: visionModel,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionAnalysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const geminiData = JSON.parse(jsonText);
    
    // Step 2: Cross-reference the identified product name with our backend FSSAI dataset.
    const fssaiProduct = await findProductByName(geminiData.productName);

    const finalResult: AnalysisResult = {
      ...geminiData,
      fssaiVerified: fssaiProduct !== null,
    };
    
    return finalResult;

  } catch (error) {
    console.error("Error analyzing food label:", error);
    throw new Error("Sorry, I couldn't read the label. Please try a clearer picture. 💖");
  }
};

export const getMealSuggestionStream = async (history: ChatMessage[], newUserMessage: string) => {
  const chat = ai.chats.create({
    model: textModel,
    config: { systemInstruction: LUVABLE_SYSTEM_PROMPT },
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
  });

  return chat.sendMessageStream({ message: newUserMessage });
};
