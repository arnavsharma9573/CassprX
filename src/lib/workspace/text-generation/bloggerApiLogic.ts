import { api } from "@/config/axios";
import { formatApiString } from "@/lib/helper";
import { Brand } from "@/store/feature/brandSlice";

// ✅ Interface ko update karo
interface BloggerTaskData {
  topic?: string;
  primary_keyword?: string;
  target_audience?: string;
  post_type?: string;
  include_affiliate_links?: "Yes" | "No";
  include_last_updated?: "Yes" | "No"; // Nayi key
  include_affiliate_disclosure?: "Yes" | "No"; // Nayi key
}

// const formatApiString = (input: string | undefined): string | undefined => {
//   if (!input) return undefined;
//   return input.toLowerCase().replace(/ /g, "_");
// };

export const generateBloggerPost = async (
  taskData: BloggerTaskData,
  brandProfile: Brand
) => {
  // ✅ user_profile object ko update karo
  const userProfilePayload = {
    niche: brandProfile.industry || "General Business",
    audience_type: brandProfile.targetAudience || "General Audience",
    tone_preference: brandProfile.defaultTone || "instructional",
    target_audience: brandProfile.targetAudience || "General Audience",
    primary_language: "en",
    // Ab yeh value chat se aayegi, agar user ne select ki hai to
    include_last_updated: taskData.include_last_updated
      ? taskData.include_last_updated === "Yes"
      : true, // API default 'true' hai
    always_include_disclosure: taskData.include_affiliate_disclosure === "Yes",
  };

  const requestBody = {
    topic: taskData.topic,
    user_profile: userProfilePayload,
    primary_keyword: taskData.primary_keyword,
    target_audience: taskData.target_audience,
    post_type: formatApiString(taskData.post_type),
    include_affiliate_links: taskData.include_affiliate_links === "Yes",
    // constraints: {},
  };

  console.log(
    "Sending to /blogger/generate:",
    JSON.stringify(requestBody, null, 2)
  );

  try {
    const response = await api.post("/api/text-generation/blogger/generate", requestBody);
    return response.data;
  } catch (error) {
    console.error("Blogger API Error:", error);
    throw new Error("Failed to generate blog post.");
  }
};
