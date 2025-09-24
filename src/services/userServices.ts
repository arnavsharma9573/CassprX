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

