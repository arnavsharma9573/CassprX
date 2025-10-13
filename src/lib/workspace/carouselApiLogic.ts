import { api } from "@/config/axios";

export interface BusinessProfile {
  product_category: string;
  product_description: string;
  target_audience: string;
  pain_point: string;
  content_goal: string;
  industry_focus: string;
}

export interface ContentIdea {
  title: string;
  description: string;
}

export interface FramePromptInputs {
  platform: string;
  brand_tone: string;
  call_to_action: string;
  visual_style: string;
  key_statistics?: string;
  personal_story?: string;
  selected_idea: ContentIdea;
}

export interface BrandGuidelines {
  primaryColor: string;
  fontFamily: string;
}

export async function generateContentIdeas(
  profile: BusinessProfile
): Promise<ContentIdea[]> {
  try {
    const response = await api.post(
      "/api/image-generation/carousel/ideas",
      profile
    );
    console.log(response.data.data.ideas);
    return response.data.data.ideas;
  } catch (error) {
    console.error("Axios error generating content ideas:", error);
    throw new Error("Failed to generate content ideas");
  }
}

/**
 * PHASE 2 API CALL: Generate raw frame prompts for a selected idea.
 */
export async function generateFramePrompts(
  profile: BusinessProfile,
  inputs: FramePromptInputs
): Promise<string[]> {
  try {
    const payload = {
      user_inputs: profile,
      selected_idea: inputs.selected_idea,
      platform: inputs.platform,
      brand_tone: inputs.brand_tone,
      call_to_action: inputs.call_to_action,
      visual_style: inputs.visual_style,
      key_statistics: inputs.key_statistics,
      personal_story: inputs.personal_story,
    };
    const response = await api.post(
      "/api/image-generation/carousel/frame-prompts",
      payload
    );
    return response.data.data.prompts;
  } catch (error) {
    console.error("Axios error generating frame prompts:", error);
    throw new Error("Failed to generate frame prompts");
  }
}

/**
 * PHASE 3 API CALL: Start the asynchronous job to generate visuals.
 */
export async function startVisualGeneration(
  framePrompts: string[],
  brandGuidelines: BrandGuidelines,
  generateImages: boolean,
  files?: { mascot_file?: File; logo_file?: File; product_file?: File }
): Promise<{ jobId: string }> {
  const formData = new FormData();

  formData.append("frame_prompts", JSON.stringify(framePrompts));
  formData.append("brand_guidelines", JSON.stringify(brandGuidelines));
  formData.append("generate_images", String(generateImages));

  if (files?.logo_file) formData.append("logo_file", files.logo_file);
  if (files?.mascot_file) formData.append("mascot_file", files.mascot_file);
  if (files?.product_file) formData.append("product_file", files.product_file);

  try {
    const response = await api.post(
      "/api/image-generation/carousel/generate-visuals",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting visual generation:", error);
    throw new Error("Failed to start visual generation job");
  }
}

/**
 * POLLING: Poll for the status of the generation job.
 */
export async function pollCarouselJobStatus(jobId: string) {
  try {
    const response = await api.get(`/api/image-generation/carousel/jobs/${jobId}`);
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    console.error(`Axios error polling job status for ID ${jobId}:`, error);
    throw new Error(`Failed to get job status for job ID: ${jobId}`);
  }
}
