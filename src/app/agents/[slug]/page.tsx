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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = agentsData.find((a) => a.slug === slug);
  if (!agent) {
    return {
      title: "Agent Not Found",
    };
  }
  return {
    title: `${agent.title} | CassprAir`,
    description: agent.description,
  };
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = agentsData.find((a) => a.slug === slug);

  if (!agent) {
    notFound();
  }

  return <AgentPageClient agent={agent} />;
}
