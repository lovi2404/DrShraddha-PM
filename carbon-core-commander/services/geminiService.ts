
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCarbonInsights = async (dashboardData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Lead Strategist for the Carbon Core Commander console. Analyze this performance data: ${JSON.stringify(dashboardData)}. 
      Provide 3 brief, actionable tactical maneuvers for emissions abatement and identify the most critical strategic risk. 
      Maintain a high-level military/command professional tone. Keep it concise.`,
      config: {
        systemInstruction: "You are the Carbon Core Intelligence Unit (CCIU). Your goal is to provide elite carbon reduction strategy insights for planetary-scale operations.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("CCIU Error:", error);
    return "Intelligence link unstable. Manual data verification required for strategic analysis.";
  }
};
