import AiChatBot from '@/components/dashboard/content-calendar/ChatBotDemo';

export default function ContentCalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-full">
      {/* 1. Page Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {children}
      </main>

      {/* 2. AI Chatbot (Fixed Width) */}
      <div className="hidden lg:block w-[50%] max-w-[640px]">
        <AiChatBot />
      </div>
    </div>
  );
}

