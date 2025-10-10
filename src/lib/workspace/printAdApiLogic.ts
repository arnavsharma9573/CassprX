import { api } from "@/config/axios";

export interface CampaignData {
  common_info: {
    name: string;
    brand_name: string;
    objective: string;
    key_message: string;
    call_to_action: string;
    target_audience: string;
  };
  ad_type: {
    name: string;
    category: string;
  };
  format: {
    aspect_ratio: string;
    dimensions: string;
  };
  ad_specific: {
    distribution_context: string;
  };
  ad_copy: {
    headline: string;
    body: string;
  };
  creative_requirements: {
    has_creative_requirements: boolean;
  };
}

export async function startPrintAdGenerationJob(
  formData: FormData
): Promise<{ jobId: string }> {
  try {
    const response = await api.post("/api/v1/print-ads/generate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { jobId: response.data.job_id };
  } catch (error) {
    console.error("Axios error starting print ad generation job:", error);
    throw new Error("Failed to start print ad generation job");
  }
}

export async function pollPrintAdJobStatus(jobId: string) {
  try {
    const response = await api.get(`/api/v1/print-ads/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Axios error polling print ad job ID ${jobId}:`, error);
    throw new Error("Failed to get print ad job status");
  }
}
