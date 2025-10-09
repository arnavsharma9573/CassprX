import { ContentCreatorSubTask } from "@/store/feature/workflowSlice";

export interface FlowStep {
  question: string;
  key: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

export interface WorkflowPhase {
  name: string; // "IDEATION", "DETAILS", "FINALIZE"
  steps: FlowStep[];
}

export interface Workflow {
  phases: WorkflowPhase[];
}

export const contentCreatorFlows: Record<ContentCreatorSubTask, Workflow> = {
  CAROUSEL: {
    phases: [
      // == PHASE 0: Ideation API Questions ==
      {
        name: "IDEATION",
        steps: [
          {
            question:
              "Let's start with your business profile. What category best describes your product?",
            key: "product_category",
            type: "select",
            options: [
              "SaaS/Software Tool",
              "E-commerce",
              "Consulting",
              "Local Business",
              "Creator/Influencer",
            ],
          },
          {
            question: "Great! Now, briefly describe your product or service.",
            key: "product_description",
            type: "textarea",
          },
          {
            question: "Who is your target audience?",
            key: "target_audience",
            type: "text",
          },
          {
            question:
              "What specific pain point or problem does your product solve for them?",
            key: "pain_point",
            type: "textarea",
          },
          {
            question:
              "What is the primary goal of this content? (e.g., Lead Generation, Brand Awareness)",
            key: "content_goal",
            type: "text",
          },
          {
            question: "Which industry are you focusing on?",
            key: "industry_focus",
            type: "text",
          },
        ],
      },
      // == PHASE 1: Frame Prompts API Questions ==
      {
        name: "DETAILS",
        steps: [
          {
            question: "Which platform is this carousel for?",
            key: "platform",
            type: "select",
            options: ["Instagram", "LinkedIn", "Facebook", "Twitter"],
          },
          {
            question: "What should be the tone of the content?",
            key: "brand_tone",
            type: "select",
            options: [
              "Friendly & Conversational",
              "Professional & Authoritative",
              "Witty & Humorous",
              "Inspirational",
            ],
          },
          {
            question: "What visual style are you aiming for?",
            key: "visual_style",
            type: "select",
            options: [
              "Bold & Colorful",
              "Minimalist & Clean",
              "Corporate & Sleek",
              "Playful & Illustrated",
            ],
          },
          {
            question:
              "What is the Call To Action? (e.g., 'Sign up for our free trial!')",
            key: "call_to_action",
            type: "text",
          },
          {
            question:
              "Do you have any key statistics to include? (Optional, press enter to skip)",
            key: "key_statistics",
            type: "text",
            required: false,
          },
          {
            question:
              "Is there a personal story or anecdote to add? (Optional, press enter to skip)",
            key: "personal_story",
            type: "textarea",
            required: false,
          },
        ],
      },
      // == PHASE 2: Final Generation Question ==
      {
        name: "FINALIZE",
        steps: [
          {
            question:
              "Finally, should I generate the final images, or just the text prompts for them?",
            key: "generate_images",
            type: "select",
            options: ["Generate Images", "Only Text Prompts"],
          },
        ],
      },
    ],
  },
  MASCOT: {
    phases: [
      {
        name: "MASCOT_PROMPTING",
        steps: [
          {
            question:
              "First, give me a one-sentence description of your brand.",
            key: "brand_description",
            type: "textarea",
          },
          {
            question: "Who is the primary audience for this mascot?",
            key: "primary_audience",
            type: "text",
          },
          {
            question:
              "What feeling should the mascot evoke? (e.g., 'Friendly and trustworthy')",
            key: "desired_feeling",
            type: "text",
          },
          {
            question:
              "What is the core idea for the mascot? (e.g., 'a cheerful robot made of recycled materials')",
            key: "mascot_idea",
            type: "textarea",
          },
          {
            question: "Choose a visual style.",
            key: "visual_style",
            type: "select",
            options: [
              "studio_ghibli",
              "van_gogh",
              "cyberpunk",
              "victorian_royalty",
              "manga",
              "lego",
              "muppet",
              "cookie",
            ],
          },
          {
            question: "Where will this mascot primarily be used?",
            key: "usage_context",
            type: "text",
          },
          {
            question: "Any color preferences? (Optional)",
            key: "color_preferences",
            type: "text",
            required: false,
          },
        ],
      },
      {
        name: "MASCOT_GENERATION",
        steps: [],
      },
      {
        name: "EDIT_DECISION",
        steps: [
          {
            question: "Here's your mascot! What would you like to do next?",
            key: "edit_choice",
            type: "select",
            options: [
              "Start an editing session",
              "I'm happy with it, let's finish.",
            ],
          },
        ],
      },
      {
        name: "EDITING_LOOP",
        steps: [
          {
            question:
              "Describe the change you'd like to make (e.g., 'add sunglasses'), or type 'done' to finish.",
            key: "edit_prompt",
            type: "textarea",
          },
        ],
      },
    ],
  },
  MEME: {
    // Wrapped in a phase for consistency
    phases: [
      {
        name: "MEME_CREATION",
        steps: [
          {
            question: "Describe the meme concept or scenario.",
            key: "concept",
            type: "textarea",
          },
          {
            question: "What text should be on the top?",
            key: "topText",
            type: "text",
          },
          {
            question: "What text should be on the bottom?",
            key: "bottomText",
            type: "text",
          },
        ],
      },
    ],
  },
  UGC: { phases: [] },
  PRESET: { phases: [] },
  PRINT_AD: { phases: [] },
};
