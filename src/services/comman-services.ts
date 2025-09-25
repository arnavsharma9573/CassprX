import { api } from "@/config/axios";
import { FormData } from "@/types/common";

export const joinWaitingList = async (formData: FormData) => {
  try {
    const response = await api.post("/api/visited/user", formData);
    return response.data;
  } catch (error) {
    console.log("Error submitting to waiting list:", error);
    throw error;
  }
};
