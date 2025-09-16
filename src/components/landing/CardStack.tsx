"use client";
import { CardStack } from "../ui/card-stack";
import { cn } from "@/lib/utils";
export function CardStackDemo() {
  return (
    <div className="flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Brand Sentinel",
    designation: "Chief Brand Strategist",
    content: (
      <p>
        I continuously analyze your brand's voice and market positioning. My job
        is to ensure every piece of content is a perfect reflection of your{" "}
        <Highlight>brand's core identity</Highlight>.
      </p>
    ),
  },
  {
    id: 1,
    name: "Content Weaver",
    designation: "Lead Content Architect",
    content: (
      <p>
        Just provide a <Highlight>strategic brief</Highlight>, and I'll build a
        comprehensive content calendar. I turn your ideas into{" "}
        <Highlight>ready-to-post content</Highlight> tailored for each platform.
      </p>
    ),
  },
  {
    id: 2,
    name: "Insight Analyst",
    designation: "Data & Analytics Specialist",
    content: (
      <p>
        I don't just post; I analyze. I track engagement, identify{" "}
        <Highlight>audience insights</Highlight>, and{" "}
        <Highlight>optimize your strategy</Highlight> in real-time for maximum
        impact.
      </p>
    ),
  },
];
