export interface QuestionOption {
  value: string; // e.g., '1', '2'
  label: string; // e.g., 'Existing product/service'
  nextQuestionId: string;
}

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice" | "text" | "final";
  options?: QuestionOption[];
  nextQuestionId?: string; // Used for text questions
}

// FIX: Export the initial question ID to resolve the error
export const initialQuestionId = "q1_promotion_type";

export const questionFlow: Record<string, Question> = {
  // --- Initial Question ---
  q1_promotion_type: {
    id: "q1_promotion_type",
    text: `Welcome! Let's create a winning campaign plan.

First, what are you promoting?
====================================
1. An existing product/service
2. A new feature for an existing product
3. A brand new product (this will involve a comprehensive questionnaire)

Please select an option to begin.`,
    type: "multiple-choice",
    options: [
      {
        value: "1",
        label: "Existing product/service",
        nextQuestionId: "q_social_followers",
      },
      {
        value: "2",
        label: "New feature for existing product",
        nextQuestionId: "q_feature_name",
      },
      {
        value: "3",
        label: "Brand new product",
        nextQuestionId: "q_brand_intro",
      },
    ],
  },

  // --- Path 2: New Feature for Existing Product ---
  q_feature_name: {
    id: "q_feature_name",
    text: "Great, let's get the details for your new feature. What is its name?",
    type: "text",
    nextQuestionId: "q_feature_description",
  },
  q_feature_description: {
    id: "q_feature_description",
    text: "And what does this feature do? (brief description)",
    type: "text",
    nextQuestionId: "q_feature_usp",
  },
  q_feature_usp: {
    id: "q_feature_usp",
    text: "What's the main benefit or USP (Unique Selling Proposition) of this feature?",
    type: "text",
    nextQuestionId: "q_feature_audience",
  },
  q_feature_audience: {
    id: "q_feature_audience",
    text: "Who is this feature primarily for?",
    type: "text",
    nextQuestionId: "q_feature_problem",
  },
  q_feature_problem: {
    id: "q_feature_problem",
    text: "What problem does this feature solve for your users?",
    type: "text",
    nextQuestionId: "q_feature_differentiation",
  },
  q_feature_differentiation: {
    id: "q_feature_differentiation",
    text: "And finally, how is this feature different from what competitors offer?",
    type: "text",
    nextQuestionId: "q_social_followers", // Merge back into the main flow
  },

  // --- Path 3: Brand New Product ---
  q_brand_intro: {
    id: "q_brand_intro",
    text: `Excellent! We're starting with a brand new product.

To create the best strategy, I need to understand your business deeply. I'm going to ask a series of questions about your brand, audience, and market. This will be comprehensive.

Ready to start the brand questionnaire?`,
    type: "multiple-choice",
    options: [
      {
        value: "1",
        label: "Yes, let's start!",
        nextQuestionId: "q_brand_business_name",
      },
      {
        value: "2",
        label: "No, not right now.",
        nextQuestionId: "q_end_early",
      },
    ],
  },

  // --- Placeholder for the comprehensive questionnaire from branddata.py ---
  q_brand_business_name: {
    id: "q_brand_business_name",
    text: "Great! First, what is your business or product name?",
    type: "text",
    nextQuestionId: "q_brand_what_you_sell",
  },
  q_brand_what_you_sell: {
    id: "q_brand_what_you_sell",
    text: "In a sentence, what do you sell?",
    type: "text",
    nextQuestionId: "q_brand_pain_point",
  },
  q_brand_pain_point: {
    id: "q_brand_pain_point",
    text: "What is the primary painful problem your product solves for customers?",
    type: "text",
    nextQuestionId: "q_brand_transformation",
  },
  q_brand_transformation: {
    id: "q_brand_transformation",
    text: "What is the dream transformation or ideal result your customers experience after using your product?",
    type: "text",
    nextQuestionId: "q_social_followers", // This is where the questionnaire ends and campaign planning begins
  },
  // ... You would add all other questions from your branddata.py here ...

  // --- Campaign Planning Questions (common to all paths) ---
  q_social_followers: {
    id: "q_social_followers",
    text: `Got it. Now let's look at your current social media presence.
    
How many followers do you have on Instagram? (Enter 0 if none)`,
    type: "text",
    nextQuestionId: "q_social_followers_twitter",
  },
  q_social_followers_twitter: {
    id: "q_social_followers_twitter",
    text: "And on X (formerly Twitter)?",
    type: "text",
    nextQuestionId: "q_social_followers_linkedin",
  },
  q_social_followers_linkedin: {
    id: "q_social_followers_linkedin",
    text: "How about LinkedIn?",
    type: "text",
    nextQuestionId: "q_social_followers_facebook",
  },
  q_social_followers_facebook: {
    id: "q_social_followers_facebook",
    text: "Finally, how many followers on Facebook?",
    type: "text",
    nextQuestionId: "q_campaign_purpose",
  },

  q_campaign_purpose: {
    id: "q_campaign_purpose",
    text: `Thanks. Now, what is the primary goal of this campaign?

1. Brand Awareness
2. Product Launch / Feature Release
3. Community Building
4. Lead Generation
5. Customer Retention
6. Engagement Boost`,
    type: "multiple-choice",
    options: [
      {
        value: "1",
        label: "Brand Awareness",
        nextQuestionId: "q_content_ideas",
      },
      {
        value: "2",
        label: "Product Launch",
        nextQuestionId: "q_content_ideas",
      },
      {
        value: "3",
        label: "Community Building",
        nextQuestionId: "q_content_ideas",
      },
      {
        value: "4",
        label: "Lead Generation",
        nextQuestionId: "q_content_ideas",
      },
      {
        value: "5",
        label: "Customer Retention",
        nextQuestionId: "q_content_ideas",
      },
      {
        value: "6",
        label: "Engagement Boost",
        nextQuestionId: "q_content_ideas",
      },
    ],
  },

  q_content_ideas: {
    id: "q_content_ideas",
    text: `What are some initial content ideas you have? (e.g., "Behind-the-scenes video", "Customer testimonials")
      
Enter one idea now. We can add more later.`,
    type: "text",
    nextQuestionId: "q_posting_frequency",
  },

  q_posting_frequency: {
    id: "q_posting_frequency",
    text: "How many times per week can you realistically post?",
    type: "multiple-choice",
    options: [
      { value: "1", label: "1-2 times", nextQuestionId: "q_final_step" },
      { value: "2", label: "3-5 times", nextQuestionId: "q_final_step" },
      { value: "3", label: "5+ times", nextQuestionId: "q_final_step" },
    ],
  },

  // --- Final Step ---
  q_final_step: {
    id: "q_final_step",
    text: `Perfect! I have all the information needed to generate a strategic content calendar for you.
    
Click the button below when you're ready.`,
    type: "final",
  },

  q_end_early: {
    id: "q_end_early",
    text: "No problem. Feel free to come back whenever you're ready to build your campaign!",
    type: "final",
  },
};
