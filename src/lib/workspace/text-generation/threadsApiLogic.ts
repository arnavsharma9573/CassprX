import { api } from "@/config/axios";
import { Brand } from "@/store/feature/brandSlice";

// Helper
const formatApiString = (input: string | undefined): string | undefined => {
  if (!input) return undefined;
  return input.toLowerCase().replace(/ /g, "_");
};

// Generate Post
export const generateThreadsPost = async (
  taskData: { [key: string]: any },
  brandProfile: Brand
) => {
  const userProfilePayload = {
    niche: brandProfile.industry || "General",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "conversational",
  };

  const mediaIntentPayload =
    taskData["media_intent.type"] && taskData["media_intent.type"] !== "None"
      ? {
          type: formatApiString(taskData["media_intent.type"]),
          description: taskData["media_intent.description"],
          has_text_overlay:
            taskData["media_intent.type"] === "Text Overlay Image",
        }
      : undefined;

  const requestBody = {
    raw_idea: taskData.raw_idea,
    user_profile: userProfilePayload,
    tone: formatApiString(taskData.tone),
    include_conversation_starter: taskData.include_conversation_starter
      ? taskData.include_conversation_starter === "Yes"
      : true,
    media_intent: mediaIntentPayload,
  };

  try {
    const response = await api.post(
      "/api/text-generation/threads/generate",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Threads Generate API Error:", error);
    throw new Error("Failed to generate Threads post.");
  }
};

// Interact with Post
export const generateThreadsInteraction = async (
  taskData: { [key: string]: any },
  brandProfile: Brand
) => {
  const userProfilePayload = {
    niche: brandProfile.industry || "General",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "conversational",
  };

  const requestBody = {
    threads_post_url: taskData.threads_post_url,
    user_profile: userProfilePayload,
    user_reaction: taskData.user_reaction,
    interaction_type: formatApiString(taskData.interaction_type),
  };

  try {
    const response = await api.post("/threads/interact", requestBody);
    return response.data;
  } catch (error) {
    console.error("Threads Interact API Error:", error);
    throw new Error("Failed to generate Threads interaction.");
  }
};
