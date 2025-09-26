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
