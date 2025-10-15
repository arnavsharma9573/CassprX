import { CopywriterSubTask } from "@/store/feature/workflowSlice";

// Interface (inhe change mat karna)
interface WorkflowStep {
  question: string;
  key: string;
  type: "text" | "select" | "textarea";
  options?: string[];
  isOptional?: boolean;
}

interface WorkflowPhase {
  phase: number;
  steps: WorkflowStep[];
}

export const xGenerateWorkflow: WorkflowPhase[] = [
  {
    phase: 0,
    steps: [
      {
        question: "Let's craft a Tweet. What's the core idea or topic?",
        key: "raw_idea", // Maps to: `raw_idea` (Required)
        type: "textarea",
      },
      {
        question: "What's the tone for this tweet?",
        key: "target_tone", // Maps to: `target_tone` (Optional)
        type: "select",
        options: [
          "Casual",
          "Witty",
          "Bold",
          "Inspirational",
          "Humorous",
          "Professional",
        ],
        isOptional: true,
      },
    ],
  },
];

export const xInteractWorkflow: WorkflowPhase[] = [
  {
    phase: 0,
    steps: [
      {
        question:
          "Great! Please provide the URL of the X post you want to interact with.",
        key: "x_post_url", // Maps to: `x_post_url` (Required)
        type: "text",
      },
      {
        question: "How do you want to react to this post?",
        key: "interaction_type", // Maps to: `interaction_type` (Optional)
        type: "select",
        options: [
          "Reply",
          "Quote Tweet",
          "Appreciation",
          "Rejection",
          "Sarcasm",
          "Fact Check",
        ],
        isOptional: true,
      },
    ],
  },
];

export const threadsGenerateWorkflow: WorkflowPhase[] = [
  {
    phase: 0, // Core Idea
    steps: [
      {
        question:
          "Great! What's the core idea, insight, or story for your Threads post?",
        key: "raw_idea",
        type: "textarea",
      },
    ],
  },
  {
    phase: 1, // Media Intent (Branching Point)
    steps: [
      {
        question: "Do you plan to attach any media to this post?",
        key: "media_intent.type",
        type: "select",
        options: [
          "None",
          "Single Image",
          "Carousel",
          "Video",
          "Text Overlay Image",
        ],
        isOptional: true,
      },
    ],
  },
  {
    phase: 2, // Media Details (Conditional Phase)
    steps: [
      {
        question:
          "Please provide a brief description of the media content for context.",
        key: "media_intent.description",
        type: "text",
        isOptional: true,
      },
    ],
  },
  {
    phase: 3, // Final Touches
    steps: [
      {
        question: "What tone should the post have?",
        key: "tone",
        type: "select",
        options: [
          "Conversational",
          "Reflective",
          "Curious",
          "Warm",
          "Playful",
          "Optimistic",
          "Vulnerable",
        ],
        isOptional: true,
      },
      {
        question:
          "Should I end the post with a question to start a conversation?",
        key: "include_conversation_starter",
        type: "select",
        options: ["Yes", "No"],
        isOptional: true,
      },
    ],
  },
];

export const threadsInteractWorkflow: WorkflowPhase[] = [
  {
    phase: 0,
    steps: [
      {
        question:
          "Awesome! Please provide the URL of the Threads post you want to interact with.",
        key: "threads_post_url",
        type: "text",
      },
      {
        question: "How do you want to react to this post?",
        key: "interaction_type",
        type: "select",
        options: [
          "Reply",
          "Repost with Comment",
          "Appreciation",
          "Thoughtful Disagreement",
          "Add Perspective",
          "Ask for Clarification",
        ],
        isOptional: true,
      },
      {
        question: "What are your brief thoughts on this? (Optional)",
        key: "user_reaction",
        type: "textarea",
        isOptional: true,
      },
    ],
  },
];

export const linkedinPostWorkflow: WorkflowPhase[] = [
  {
    phase: 0,
    steps: [
      {
        question: "Awesome! What's the core idea for your new post?",
        key: "raw_idea",
        type: "textarea",
      },
    ],
  },
  {
    phase: 1,
    steps: [
      {
        question: "Which narrative template should I use?",
        key: "narrative_template",
        type: "select",
        options: [
          "Freeform",
          "Problem -> Breakthrough",
          "Old Way vs. New Way",
          "Myth -> Data -> Result",
          "Failure -> Success",
        ],
        isOptional: true,
      },
    ],
  },
];

export const linkedinInteractWorkflow: WorkflowPhase[] = [
  {
    phase: 0,
    steps: [
      {
        question:
          "Great! Please provide the URL of the LinkedIn post you want to comment on.",
        key: "linkedin_post_url",
        type: "text",
      },
      {
        question:
          "What are your thoughts on this post? This will guide my comment.",
        key: "user_reaction",
        type: "textarea",
        isOptional: true,
      },
    ],
  },
];

// ✅ Is object ko poora update kar do
export const copywriterWorkflows: Record<CopywriterSubTask, WorkflowPhase[]> = {
  // --- BLOGGER WORKFLOW (API se mapped) ---
  BLOGGER: [
    {
      phase: 0,
      steps: [
        {
          question:
            "Great, let's write a blog post! What is the primary topic or title?",
          key: "topic", // Maps to: `topic` (Required)
          type: "text",
        },
        {
          question:
            "What is the main SEO keyword you want to target for this article?",
          key: "primary_keyword", // Maps to: `primary_keyword` (Optional)
          type: "text",
          isOptional: true,
        },
        {
          question:
            "Who is the specific target audience for this post? (e.g., 'beginners', 'solopreneurs')",
          key: "target_audience", // Maps to: `target_audience` (Optional)
          type: "text",
          isOptional: true,
        },
      ],
    },
    {
      phase: 1,
      steps: [
        {
          question:
            "What type of article is this? This helps with the structure.",
          key: "post_type",
          type: "select",
          options: [
            "Comprehensive Guide",
            "Best_X_Roundup",
            "Product Review",
            "Listicle Deep-Dive",
            "Evergreen Resource",
            "Personal Story With Takeaways",
          ],
          isOptional: true,
        },
        {
          question: "Should I include placeholders for affiliate links?",
          key: "include_affiliate_links",
          type: "select",
          options: ["Yes", "No"],
          isOptional: true,
        },
        {
          question: "Should this post include a 'Last updated' date?",
          key: "include_last_updated", // API key: user_profile.include_last_updated
          type: "select",
          options: ["Yes", "No"],
          isOptional: true,
        },
        {
          question: "Should an affiliate disclosure be added to this post?",
          key: "include_affiliate_disclosure", // API key: constraints.include_affiliate_disclosure
          type: "select",
          options: ["Yes", "No"],
          isOptional: true,
        },
      ],
    },
  ],
  LINKEDIN: [
    {
      phase: 0,
      steps: [
        {
          question: "What would you like to do on LinkedIn?",
          key: "linkedin_action",
          type: "select",
          options: ["Generate a new Post", "Comment on a Post"],
        },
      ],
    },
  ],
  X: [
    {
      phase: 0,
      steps: [
        {
          question: "What would you like to do on X (Twitter)?",
          key: "x_action",
          type: "select",
          options: ["Generate a new Tweet", "Interact with a Tweet"],
        },
      ],
    },
  ],
  THREADS: [
    {
      phase: 0,
      steps: [
        {
          question: "What would you like to do on Threads?",
          key: "threads_action",
          type: "select",
          options: ["Generate a new Post", "Interact with a Post"],
        },
      ],
    },
  ],
  MEDIUM: [
    {
      phase: 0,
      steps: [
        {
          question:
            "Let's write a Medium article. What's the core idea or story you want to share?",
          key: "raw_idea", // Maps to: `raw_idea` (Required)
          type: "textarea",
        },
        {
          question:
            "What type of article is it? (e.g., a personal story, a deep explanation)",
          key: "post_type", // Maps to: `post_type` (Optional)
          type: "select",
          options: [
            "Personal Insight Story",
            "Deep Explanation",
            "Framework / Mental Model",
            "Thoughtful Opinion",
            "Behind-the-Scenes Process",
          ],
          isOptional: true,
        },
        {
          question: "What tone should I use for this article?",
          key: "tone", // Maps to: `tone` (Optional)
          type: "select",
          options: [
            "Reflective",
            "Analytical",
            "Storytelling",
            "Mentor-like",
            "Thoughtful",
            "Curious",
          ],
          isOptional: true,
        },
      ],
    },
  ],
};
