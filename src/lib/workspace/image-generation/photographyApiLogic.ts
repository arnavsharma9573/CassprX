import { api } from "@/config/axios";

export interface PhotographyPresets {
  photography_types: Record<string, string>;
  tint_colors: string[];
}

export interface PhotographyPromptInputs {
  product_name: string;
  photography_type: string;
  background_color?: string;
}

export async function getPhotographyPresets(): Promise<PhotographyPresets> {
  try {
    const response = await api.get("/api/image-generation/photography/presets");
    return response.data.data;
  } catch (error) {
    console.error("Axios error fetching photography presets:", error);
    throw new Error("Failed to fetch presets");
  }
}

export async function generatePhotographyPrompt(
  inputs: PhotographyPromptInputs
): Promise<{ prompt: string }> {
  try {
    const response = await api.post("/api/image-generation/photography/prompts", inputs);
    return response.data.data;
  } catch (error) {
    console.error("Axios error generating photography prompt:", error);
    throw new Error("Failed to generate prompt");
  }
}

export async function startPhotographyTransformJob(
  prompt: string,
  sourceImage: File
): Promise<{ jobId: string }> {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("source_image", sourceImage);

  try {
    const response = await api.post("/api/image-generation/photography/transform", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting photography transform:", error);
    throw new Error("Failed to start transform job");
  }
}

export async function pollPhotographyJobStatus(jobId: string) {
  try {
    const response = await api.get(`/api/image-generation/photography/jobs/${jobId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Axios error polling photography job ID ${jobId}:`, error);
    throw new Error("Failed to get job status");
  }
}
