import AgentPageClient from "@/components/agents/AgentPageClient";
import { agentsData } from "@/lib/agent-data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return agentsData.map((agent) => ({
    slug: agent.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const agent = agentsData.find((a) => a.slug === params.slug);
  if (!agent) {
    return {
      title: "Agent Not Found",
    };
  }
  return {
    title: `${agent.title} | PiqueAI`,
    description: agent.description,
  };
}

export default function AgentPage({ params }: { params: { slug: string } }) {
  const agent = agentsData.find((a) => a.slug === params.slug);

  if (!agent) {
    notFound();
  }

  return <AgentPageClient agent={agent} />;
}
