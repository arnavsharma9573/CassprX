import { api } from "@/config/axios";

export interface PlaygroundSession {
  session_id: string;
  currentImageUrl: string; // FIX: Use camelCase
  historyUrls: string[];
}

export async function startStyleAnalysisJob(
  referenceImage: File,
  styleComponent: string,
  summarizePrompt: boolean
): Promise<{ jobId: string }> {
  const formData = new FormData();
  formData.append("reference_image", referenceImage);
  formData.append("summarize_prompt", String(summarizePrompt));

  formData.append("style_components", styleComponent);
  try {
    const response = await api.post(
      "/api/image-generation/playground/analyze-style",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting style analysis:", error);
    throw new Error("Failed to start style analysis");
  }
}

export async function startImageGenerationJob(
  prompt: string,
  quality: "medium" | "high"
): Promise<{ jobId: string }> {
  try {
    const response = await api.post(
      "/api/image-generation/playground/generate",
      {
        prompt,
        quality,
      }
    );
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting image generation:", error);
    throw new Error("Failed to start image generation");
  }
}

export async function createPlaygroundEditSession(
  baseImage: File
): Promise<{ sessionId: string }> {
  const formData = new FormData();
  formData.append("base_image", baseImage);
  try {
    const response = await api.post(
      "/api/image-generation/playground/sessions",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return { sessionId: response.data.data.session_id };
  } catch (error) {
    console.error("Axios error creating playground edit session:", error);
    throw new Error("Failed to create edit session");
  }
}

export async function startPlaygroundEditJob(
  sessionId: string,
  prompt: string
): Promise<{ jobId: string }> {
  const formData = new FormData();
  formData.append("prompt", prompt);
  try {
    const response = await api.post(
      `/api/image-generation/playground/sessions/${sessionId}/edits`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting playground edit:", error);
    throw new Error("Failed to start edit");
  }
}

export async function getPlaygroundSessionHistory(
  sessionId: string
): Promise<PlaygroundSession> {
  try {
    const response = await api.get(
      `/api/image-generation/playground/sessions/${sessionId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Axios error fetching session history for ID ${sessionId}:`,
      error
    );
    throw new Error("Failed to fetch session history");
  }
}

export async function pollPlaygroundJobStatus(jobId: string) {
  try {
    const response = await api.get(
      `/api/image-generation/playground/jobs/${jobId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Axios error polling playground job ID ${jobId}:`, error);
    throw new Error("Failed to get job status");
  }
}
