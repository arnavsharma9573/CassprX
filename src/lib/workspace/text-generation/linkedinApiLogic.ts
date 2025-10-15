import { api } from "@/config/axios";
import { Brand } from "@/store/feature/brandSlice";

// Data type for generating a new post
interface LinkedInTaskData {
  raw_idea?: string;
  narrative_template?: string;
  tone?: string;
  allow_emojis?: "Yes (minimal)" | "No";
}

// ✅ Data type for commenting on a post
interface LinkedInInteractTaskData {
  linkedin_post_url?: string;
  user_reaction?: string;
  tone?: string;
}

// Helper function (isko change nahi karna hai)
const formatNarrativeTemplate = (template: string | undefined): string | undefined => {
  if (!template || template.includes("Freeform")) return "freeform";
  const mapping: { [key: string]: string } = {
    "Problem -> Failed Fixes -> Breakthrough": "problem_failed_fixes_breakthrough",
    "Old Way vs. New Way (And Why It's Better)": "old_way_new_way_why_better",
    "Myth -> Data -> Actionable Result": "myth_data_action_result",
    "Before -> After -> Exact Steps": "before_after_exact_steps",
    "Failure -> Pivot -> Success": "failure_pivot_success",
    "Mentor's Advice -> How I Applied It -> Result": "mentor_advice_applied_result",
  };
  return mapping[template] || "freeform";
};

// Generate Post function (yeh pehle se hai)
export const generateLinkedInPost = async (
  taskData: LinkedInTaskData,
  brandProfile: Brand
) => {
  const userProfilePayload = {
    industry: brandProfile.industry || "Business",
    role: brandProfile.role || "Professional",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "professional",
  };

  const requestBody = {
    raw_idea: taskData.raw_idea,
    user_profile: userProfilePayload,
    narrative_template: formatNarrativeTemplate(taskData.narrative_template),
    tone: taskData.tone?.toLowerCase().replace("-", "_"),
    allow_emojis: taskData.allow_emojis === "Yes (minimal)",
    include_cta: true,
  };
  
  console.log("Sending to /linkedin/generate:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await api.post("/api/text-generation/linkedin/generate", requestBody);
    return response.data;
  } catch (error) {
    console.error("LinkedIn API Error:", error);
    throw new Error("Failed to generate LinkedIn post.");
  }
};

// ✅ Yeh naya function add karo
export const generateLinkedInComment = async (
  taskData: LinkedInInteractTaskData,
  brandProfile: Brand
) => {
  const userProfilePayload = {
    industry: brandProfile.industry || "Business",
    role: brandProfile.role || "Professional",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "professional",
  };

  const requestBody = {
    linkedin_post_url: taskData.linkedin_post_url,
    user_profile: userProfilePayload,
    user_reaction: taskData.user_reaction,
    tone: taskData.tone?.toLowerCase(),
    allow_emojis: true, // Comments ke liye humesha allow kar sakte hain
  };
  
  console.log("Sending to /linkedin/interact:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await api.post("/linkedin/interact", requestBody);
    return response.data;
  } catch (error) {
    console.error("LinkedIn Interact API Error:", error);
    throw new Error("Failed to generate LinkedIn comment.");
  }
};