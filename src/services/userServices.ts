import { api } from "@/config/axios";

export const GoogleSignup = async (code: string) => {
  try {
    const url = `/api/auth/google-login?code=${encodeURIComponent(code)}`;

    const response = await api.get(url);

    return response.data;
  } catch (error: any) {
    console.error("Google login GET error:", error);

    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred during Google authentication",
      error: error?.response?.data || error,
    };
  }
};

//Create Brand Profile
export const CreateBrandProfile = async (formData: FormData) => {
  try {
    const response = await api.post("/api/brand-profiles/jobs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating brand profile:", error);
    throw error;
  }
};

export const GetBrandProfileJobStatus = async (jobId: string) => {
  try {
    const response = await api.get(`/api/brand-profiles/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job status:", error);
    throw error;
  }
};

export const CreateBrandKit = async (formData: FormData) => {
  try {
    const response = await api.post("api/brand-kits/create", formData);
    return response.data;
  } catch (error) {
    console.error("Error fetching job status:", error);
    throw error;
  }
};

export const createCampaignStep = async (
  text: string,
  brand_profile_id: string
): Promise<any> => {
  try {
    const response = await api.post("/api/campaigns/chat", {
      brand_profile_id,
      text, // only one message
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in createCampaignStep:", error);
    throw error.response?.data || error.message;
  }
};

export const confirmCampaignPlan = async (campaignPlan: any) => {
  try {
    // send raw JSON object, no "campaignPlan" key
    const res = await api.post("/api/campaigns/create", campaignPlan);
    return res.data;
  } catch (error: any) {
    console.error("Error confirming campaign:", error);
    throw error.response?.data || error.message;
  }
};

export const getAIRecommendations = async (campaignId: number | string) => {
  try {
    const res = await api.post(`/api/campaigns/${campaignId}/recommendations`);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching AI recommendations:", error);
    throw error.response?.data || error.message;
  }
};

export const finalizeCampaign = async (
  campaignId: number | string,
  finalizeData?: any
) => {
  try {
    const res = await api.post(
      `/api/campaigns/${campaignId}/finalize`,
      finalizeData
    );
    return res.data;
  } catch (error: any) {
    console.error("Error finalizing campaign:", error);
    throw error.response?.data || error.message;
  }
};

// Calendar creation API
export const createCalendar = async (startDate: string, campaignId: string) => {
  try {
    const res = await api.post("/api/calendar/create", {
      start_date: startDate,
      campaignId: campaignId,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error creating calendar:", error);
    throw error.response?.data || error.message;
  }
};

// Calendar job status polling API
export const getCalendarJobStatus = async (jobId: string) => {
  try {
    const res = await api.get(`/api/calendar/${jobId}`);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching calendar job status:", error);
    throw error.response?.data || error.message;
  }
};

// fetch all previous data
export const getUserDetails = async () => {
  try {
    const res = await api.get("api/auth/user");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching calendar job status:", error);
    throw error.response?.data || error.message;
  }
};

export const fetchCalendarDataByBrandId = async (profileId: string) => {
  try {
    const res = await api.post("/api/auth/calander-data", {
      profileId: profileId,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching calendar data:", error);
    throw error.response?.data || error.message;
  }
};
