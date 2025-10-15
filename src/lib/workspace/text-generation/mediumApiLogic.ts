import { api } from "@/config/axios";
import { Brand } from "@/store/feature/brandSlice";

interface MediumTaskData {
  raw_idea?: string;
  post_type?: string;
  tone?: string;
}

const formatApiString = (input: string | undefined): string | undefined => {
  if (!input) return undefined;
  // "Personal Insight Story" ko "personal_insight_story" banayega
  return input.toLowerCase().replace(/ \/ /g, "_").replace(/ /g, "_");
};

export const generateMediumArticle = async (
  taskData: MediumTaskData,
  brandProfile: Brand
) => {
  const userProfilePayload = {
    background: brandProfile.background || "A professional in the industry", // 'background' brand mein add karna padega
    writing_style: "clear and conversational", // Isko bhi brand se la sakte hain
    tone_preference: formatApiString(taskData.tone) || brandProfile.defaultTone || "reflective",
    always_include_tl_dr: true,
  };

  const requestBody = {
    raw_idea: taskData.raw_idea,
    user_profile: userProfilePayload,
    post_type: formatApiString(taskData.post_type),
    tone: formatApiString(taskData.tone),
  };
  
  console.log("Sending to /api/text-generation/medium/generate:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await api.post("/api/text-generation/medium/generate", requestBody);
    return response.data;
  } catch (error) {
    console.error("Medium API Error:", error);
    throw new Error("Failed to generate Medium article.");
  }
};