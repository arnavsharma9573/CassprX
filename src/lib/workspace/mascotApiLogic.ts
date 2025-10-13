import { api } from "@/config/axios";

export interface MascotPromptInputs {
  brand_description: string;
  primary_audience: string;
  desired_feeling: string;
  mascot_idea: string;
  visual_style: string;
  usage_context: string;
  color_preferences?: string;
}

export interface MascotEditInputs {
  session_id: string;
  prompt: string;
  component_images?: File[];
}

export async function generateMascotPrompts(
  inputs: MascotPromptInputs
): Promise<string[]> {
  try {
    const response = await api.post(
      "/api/image-generation/mascot/prompts",
      inputs
    );
    return response.data.data.prompts;
  } catch (error) {
    console.error("Axios error generating mascot prompts:", error);
    throw new Error("Failed to generate mascot prompts");
  }
}

export async function startMascotGenerationJob(
  prompt: string
): Promise<{ jobId: string }> {
  try {
    const response = await api.post("/api/image-generation/mascot/generate", {
      prompt,
    });
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting mascot generation:", error);
    throw new Error("Failed to start mascot generation");
  }
}

export async function createMascotEditSession(
  baseImage: File
): Promise<{ sessionId: string; initialImageUrl: string }> {
  const formData = new FormData();
  formData.append("base_image", baseImage);
  try {
    const response = await api.post(
      "/api/image-generation/mascot/sessions",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return {
      sessionId: response.data.data.session_id,
      initialImageUrl: response.data.data.initial_image_url,
    };
  } catch (error) {
    console.error("Axios error creating mascot edit session:", error);
    throw new Error("Failed to create edit session");
  }
}

export async function startMascotEditJob(
  inputs: MascotEditInputs
): Promise<{ jobId: string }> {
  const formData = new FormData();
  formData.append("prompt", inputs.prompt);
  if (inputs.component_images) {
    inputs.component_images.forEach((file) =>
      formData.append("component_images", file)
    );
  }
  try {
    const response = await api.post(
      `/api/image-generation/mascot/sessions/${inputs.session_id}/edits`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting mascot edit job:", error);
    throw new Error("Failed to start edit job");
  }
}

export async function pollMascotJobStatus(jobId: string) {
  try {
    const response = await api.get(
      `/api/image-generation/mascot/jobs/${jobId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Axios error polling mascot job ID ${jobId}:`, error);
    throw new Error("Failed to get mascot job status");
  }
}
