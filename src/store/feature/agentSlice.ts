import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Agent {
  id: string;
  title: string;
  icon: string;
  description?: string;
}

interface AgentState {
  selectedAgent: Agent | null;
  availableAgents: Agent[];
}

const initialState: AgentState = {
  selectedAgent: null,
  availableAgents: [
    {
      id: "content-creator",
      title: "Content Creator",
      icon: "edit",
      description: "Generates engaging social media posts.",
    },
    {
      id: "copywriter",
      title: "Copywriter",
      icon: "pencil",
      description: "Writes compelling ad and website copy.",
    },
    {
      id: "market-research",
      title: "Market Research",
      icon: "search",
      description: "Analyzes market trends and insights.",
    },
    {
      id: "persona-builder",
      title: "Persona Builder",
      icon: "users",
      description: "Creates detailed customer personas.",
    },
    {
      id: "auto-posting",
      title: "Auto-Posting",
      icon: "send",
      description: "Schedules and posts content automatically.",
    },
    {
      id: "content-calendar",
      title: "Content Calendar",
      icon: "calendar",
      description: "Organizes your content strategy.",
    },
    {
      id: "content-repurposer",
      title: "Content Repurposer",
      icon: "recycle",
      description: "Adapts existing content for new platforms.",
    },

    {
      id: "competitive-analysis",
      title: "Competitive Analysis",
      icon: "chart",
      description: "Tracks and analyzes competitor strategies.",
    },
  ],
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    selectAgent: (state, action: PayloadAction<Agent>) => {
      state.selectedAgent = action.payload;
    },
    clearAgent: (state) => {
      state.selectedAgent = null;
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.availableAgents.push(action.payload);
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.availableAgents = state.availableAgents.filter(
        (agent) => agent.id !== action.payload
      );
    },
  },
});

export const { selectAgent, clearAgent, addAgent, removeAgent } =
  agentSlice.actions;

export default agentSlice.reducer;

// Selectors
export const selectCurrentAgent = (state: { agent: AgentState }) =>
  state.agent.selectedAgent;
export const selectAvailableAgents = (state: { agent: AgentState }) =>
  state.agent.availableAgents;
