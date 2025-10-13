import { api } from "@/config/axios";

export interface MemeGenerationInputs {
  text: string;
  art_style: string;
  logo_desc?: string;
  mascot_desc?: string;
  product_desc?: string;
  logo_file?: File;
  mascot_file?: File;
  product_file?: File;
}

export async function startMemeGenerationJob(
  inputs: MemeGenerationInputs
): Promise<{ jobId: string }> {
  const formData = new FormData();

  formData.append("text", inputs.text);
  formData.append("art_style", inputs.art_style);

  if (inputs.logo_desc) formData.append("logo_desc", inputs.logo_desc);
  if (inputs.mascot_desc) formData.append("mascot_desc", inputs.mascot_desc);
  if (inputs.product_desc) formData.append("product_desc", inputs.product_desc);

  if (inputs.logo_file) formData.append("logo_file", inputs.logo_file);
  if (inputs.mascot_file) formData.append("mascot_file", inputs.mascot_file);
  if (inputs.product_file) formData.append("product_file", inputs.product_file);

  try {
    const response = await api.post("/api/image-generation/memes/generate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { jobId: response.data.data.job_id };
  } catch (error) {
    console.error("Axios error starting meme generation job:", error);
    throw new Error("Failed to start meme generation job");
  }
}

export async function pollMemeJobStatus(jobId: string) {
  try {
    const response = await api.get(`/api/image-generation/memes/jobs/${jobId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Axios error polling meme job ID ${jobId}:`, error);
    throw new Error("Failed to get meme job status");
  }
}
