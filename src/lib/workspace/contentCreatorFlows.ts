import { ContentCreatorSubTask } from "@/store/feature/workflowSlice";

export interface FlowStep {
  question: string;
  key: string;
  type: "text" | "textarea" | "select" | "file";
  options?: string[] | "dynamic_photo_types" | "dynamic_tint_colors";
  required?: boolean;
  dependsOn?: { key: string; value: string };
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
        // Phase 0: The main choice
        name: "MODE_SELECTION",
        steps: [
          {
            question:
              "Welcome to the Mascot Creator! What would you like to do?",
            key: "mascot_mode",
            type: "select",
            options: [
              "Generate a new mascot from an idea",
              "Directly edit an image I already have",
            ],
          },
        ],
      },
      {
        // Phase 1: Branch for full generation (prompting)
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
        // Phase 2: Automated phase for image generation
        name: "MASCOT_GENERATION",
        steps: [],
      },
      {
        // Phase 3: Decision to edit the generated mascot
        name: "EDIT_DECISION",
        steps: [
          {
            question:
              "Here's your generated mascot! What would you like to do next?",
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
        // Phase 4: Branch for uploading your own image to edit
        name: "DIRECT_EDIT_SETUP",
        steps: [
          {
            question: "Please upload the image you want to start editing.",
            key: "base_image",
            type: "file",
          },
        ],
      },
      {
        // Phase 5: The shared editing loop
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
    phases: [
      {
        name: "MEME_DETAILS",
        steps: [
          {
            question: "What text or scenario should the meme be about?",
            key: "text",
            type: "textarea",
          },
          {
            question: "Now, choose an art style for your meme.",
            key: "art_style",
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
            question: "Optionally, describe a logo to include.",
            key: "logo_desc",
            type: "text",
            required: false,
          },
          {
            question:
              "To upload a logo image, use the button below. (Optional)",
            key: "logo_file",
            type: "file",
            required: false,
          },
          {
            question: "Optionally, describe a mascot to include.",
            key: "mascot_desc",
            type: "text",
            required: false,
          },
          {
            question:
              "To upload a mascot image, use the button below. (Optional)",
            key: "mascot_file",
            type: "file",
            required: false,
          },
          {
            question: "Optionally, describe a product to include.",
            key: "product_desc",
            type: "text",
            required: false,
          },
          {
            question:
              "To upload a product image, use the button below. (Optional)",
            key: "product_file",
            type: "file",
            required: false,
          },
        ],
      },
    ],
  },
  UGC: { phases: [] },
  PRESET: {
    phases: [
      {
        name: "PRESET_DETAILS",
        steps: [
          {
            question:
              "What is the name or a brief description of the product in your image?",
            key: "product_name",
            type: "text",
          },
          {
            question: "Please upload the source image of your product.",
            key: "source_image",
            type: "file",
          },
          {
            question: "Choose a photography style preset.",
            key: "photography_type",
            type: "select",
            options: "dynamic_photo_types",
          },
          {
            question: "Choose a background color.",
            key: "background_color",
            type: "select",
            options: "dynamic_tint_colors",
            dependsOn: { key: "photography_type", value: "SOLID BACKGROUND" },
          },
        ],
      },
    ],
  },
  PRINT_AD: {
    phases: [
      {
        name: "CAMPAIGN_BRIEF",
        steps: [
          {
            question: "What is the name of this campaign?",
            key: "campaign_name",
            type: "text",
          },
          {
            question: "What is the brand name?",
            key: "brand_name",
            type: "text",
          },
          {
            question:
              "What is the main objective of this ad? (e.g., Brand Awareness, Sales)",
            key: "objective",
            type: "text",
          },
          {
            question: "What is the key message you want to convey?",
            key: "key_message",
            type: "textarea",
          },
          {
            question: "What is the call to action? (e.g., 'Visit our website')",
            key: "call_to_action",
            type: "text",
          },
          {
            question: "Describe the target audience.",
            key: "target_audience",
            type: "textarea",
          },
          {
            question: "What type of ad is this? (e.g., Poster, Magazine Ad)",
            key: "ad_type_name",
            type: "text",
          },
          {
            question: "What is the aspect ratio? (e.g., 1:1, 9:16)",
            key: "aspect_ratio",
            type: "text",
          },
          {
            question: "Where will this ad be distributed?",
            key: "distribution_context",
            type: "text",
          },
          {
            question: "What is the headline for the ad?",
            key: "headline",
            type: "text",
          },
          {
            question: "What is the body copy for the ad?",
            key: "body_copy",
            type: "textarea",
          },
          {
            question: "Please upload your brand guidelines JSON file.",
            key: "brand_guidelines_file",
            type: "file",
            required: true,
          },
          {
            question: "Optionally, upload a logo file.",
            key: "logo_file",
            type: "file",
            required: false,
          },
          {
            question: "Optionally, upload a mascot file.",
            key: "mascot_file",
            type: "file",
            required: false,
          },
          {
            question: "Optionally, upload a product image.",
            key: "product_file",
            type: "file",
            required: false,
          },
        ],
      },
    ],
  },
};
