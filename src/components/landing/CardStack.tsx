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
    name: "Content Creator Agent",
    designation: "Creative Content Specialist",
    content: (
      <p>
        I craft <Highlight>original, engaging content</Highlight> tailored to
        your brand’s style. From blogs to posts, I turn ideas into
        <Highlight>high-impact stories</Highlight>.
      </p>
    ),
  },
  {
    id: 1,
    name: "Market Research Agent",
    designation: "Audience Intelligence Partner",
    content: (
      <p>
        I dive deep into <Highlight>market trends</Highlight> and audience
        behavior. My goal is to uncover{" "}
        <Highlight>what truly resonates</Highlight>
        with your community.
      </p>
    ),
  },
  {
    id: 2,
    name: "Persona Builder Agent",
    designation: "Customer Profiling Expert",
    content: (
      <p>
        I analyze your audience to build{" "}
        <Highlight>accurate personas</Highlight>. This helps ensure every
        message aligns with <Highlight>the right people</Highlight>.
      </p>
    ),
  },
  {
    id: 3,
    name: "Auto-Posting Agent",
    designation: "Seamless Publishing Assistant",
    content: (
      <p>
        I handle <Highlight>automated scheduling</Highlight> and posting across
        channels, ensuring <Highlight>consistent delivery</Highlight> without
        the stress.
      </p>
    ),
  },
  {
    id: 4,
    name: "Content Calendar Agent",
    designation: "Strategic Planner",
    content: (
      <p>
        I transform goals into{" "}
        <Highlight>structured content calendars</Highlight>, mapping campaigns
        to <Highlight>maximize reach & impact</Highlight>.
      </p>
    ),
  },
  {
    id: 5,
    name: "Content Repurposer Agent",
    designation: "Efficiency Optimizer",
    content: (
      <p>
        I take existing content and <Highlight>repackage it</Highlight> for
        multiple platforms, multiplying your brand’s
        <Highlight>visibility & engagement</Highlight>.
      </p>
    ),
  },
  {
    id: 6,
    name: "Copywriter Agent",
    designation: "Words That Sell",
    content: (
      <p>
        I write <Highlight>clear, persuasive copy</Highlight> designed to
        capture attention and drive <Highlight>real conversions</Highlight>.
      </p>
    ),
  },
  {
    id: 7,
    name: "Competitive Analysis Agent",
    designation: "Market Watchdog",
    content: (
      <p>
        I constantly monitor <Highlight>competitors and trends</Highlight>,
        helping you adapt strategies to stay
        <Highlight>ahead of the curve</Highlight>.
      </p>
    ),
  },
];
