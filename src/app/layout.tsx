import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./Providers";

const trebuchetFont = localFont({
  src: "./fonts/trebuc.ttf",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cassprair.com/"),
  title: "CassprAIR | Automate Your Go-To-Market & Social Media Campaigns",
  description:
    "CassprAIR transforms your marketing ideas into ready-to-post content, audience insights, and automated publishing — all in just a few clicks. Simplify your entire Go-To-Market strategy, content creation, and publishing process under one intelligent platform.",
  keywords: [
    "CassprAIR",
    "social media automation",
    "AI marketing tool",
    "Go-To-Market automation",
    "content creation platform",
    "campaign builder",
    "social media scheduler",
    "marketing insights",
    "AI content planner",
    "automated publishing",
  ],
  openGraph: {
    title: "CassprAIR — Simplify, Automate & Launch Smarter Campaigns",
    description:
      "Turn your ideas into high-performing content with CassprAIR. Get instant audience insights, automate publishing, and manage your entire Go-To-Market strategy seamlessly.",
    url: "https://www.cassprair.com/",
    siteName: "CassprAIR",
    images: [
      {
        url: "/Dashboard.webp",
        width: 1200,
        height: 630,
        alt: "CassprAIR Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CassprAIR | AI-Powered Campaign & Content Automation",
    description:
      "Transform your Go-To-Market strategy into effortless campaigns with CassprAIR — your all-in-one AI-powered content and publishing platform.",
    images: ["/Banner.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${trebuchetFont.className} antialiased `}
        suppressHydrationWarning={true}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
