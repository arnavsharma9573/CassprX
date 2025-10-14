export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  role: string;
  industry: string;
  teamSize: string;
  currentChallenges: string;
  interestedFeatures: string[];
};

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  options?: string[];
  type?: "select" | "text" | "textarea" | "file";
  imageUrls?: string[];
  historyUrls?: string[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}
