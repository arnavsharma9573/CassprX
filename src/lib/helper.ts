import { Message } from "@/components/dashboard/workspace/ChatInterfaceWorkspace";

export const getPlatformName = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const name = hostname.replace("www.", "").split(".")[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    // Fix special cases
    const specialCases: Record<string, string> = {
      Linkedin: "LinkedIn",
    };

    return specialCases[formattedName] || formattedName;
  } catch (error) {
    return url;
  }
};

export async function urlToFile(
  url: string,
  filename: string,
  mimeType?: string
): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType || blob.type });
}

export const streamMessage = (
  id: string,
  fullText: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  onComplete?: () => void
) => {
  setMessages((prev) => [
    ...prev,
    { id, role: "assistant", content: "", timestamp: new Date() },
  ]);

  // Determine the speed based on the length of the text
  const speed = fullText.length > 16 ? 10 : 20;

  let index = 0;
  const interval = setInterval(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, content: fullText.substring(0, index + 1) }
          : msg
      )
    );
    index++;
    if (index > fullText.length) {
      clearInterval(interval);
      if (onComplete) {
        onComplete();
      }
    }
  }, speed); // Use the dynamic speed variable here
};
