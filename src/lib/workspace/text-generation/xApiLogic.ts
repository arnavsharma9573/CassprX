import { api } from "@/config/axios";
import { Brand } from "@/store/feature/brandSlice";

const formatApiString = (input: string | undefined): string | undefined => {
  if (!input) return undefined;
  return input.toLowerCase().replace(/ /g, "_");
};

// Generate Tweet
export const generateXPost = async (
  taskData: { [key: string]: any },
  brandProfile: Brand
) => {
  const userProfilePayload = {
    niche: brandProfile.industry || "General",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "conversational",
  };

  const requestBody = {
    raw_idea: taskData.raw_idea,
    user_profile: userProfilePayload,
    target_tone: formatApiString(taskData.target_tone),
  };

  try {
    const response = await api.post("/api/text-generation/twitter/generate", requestBody);
    return response.data;
  } catch (error) {
    console.error("X Generate API Error:", error);
    throw new Error("Failed to generate Tweet.");
  }
};

// Interact with Tweet
export const generateXInteraction = async (
  taskData: { [key: string]: any },
  brandProfile: Brand
) => {
  const userProfilePayload = {
    niche: brandProfile.industry || "General",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "conversational",
  };

  const requestBody = {
    x_post_url: taskData.x_post_url,
    user_profile: userProfilePayload,
    interaction_type: formatApiString(taskData.interaction_type),
  };

  try {
    const response = await api.post("/api/text-generation/twitter/interact", requestBody);
    return response.data;
  } catch (error) {
    console.error("X Interact API Error:", error);
    throw new Error("Failed to generate X interaction.");
  }
};
