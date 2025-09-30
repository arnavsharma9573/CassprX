type ChatMessage = {
  sender: "user" | "agent";
  message: string;
  timestamp?: string;
  type?: "text" | "competitor-analysis" | "download";
  competitors?: Array<{
    name: string;
    type: "direct" | "indirect";
    logo: string;
    strength: string;
    weakness: string;
  }>;
  downloadData?: {
    filename: string;
    size: string;
    description: string;
  };
};

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type UseCase = {
  title: string;
  description: string;
  example: string;
};

type Capability = {
  name: string; 
  level: number; // 1-5 scale
};

export type Agent = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: Feature[];
  useCases: UseCase[];
  capabilities: Capability[];
  chatMockupData: ChatMessage[];
  benefits: string[];
};

export const agentsData: Agent[] = [
  {
    slug: "content-creator",
    title: "Content Creator Agent",
    tagline: "Transform ideas into compelling content",
    description:
      "I craft original, engaging content tailored to your brand's style. From blogs to posts, I turn ideas into high-impact stories.",
    longDescription:
      "The Content Creator Agent is your creative powerhouse, designed to generate high-quality content across multiple formats and platforms. Using advanced AI algorithms, it understands your brand voice, audience preferences, and industry trends to create content that resonates and drives engagement.",
    features: [
      {
        icon: "✍️",
        title: "Multi-Format Creation",
        description:
          "Generate blogs, social posts, emails, and more in seconds",
      },
      {
        icon: "🎨",
        title: "Brand Voice Matching",
        description: "Maintains consistent tone across all your content",
      },
      {
        icon: "🚀",
        title: "SEO Optimization",
        description: "Content optimized for search engines and readability",
      },
      {
        icon: "📊",
        title: "Performance Tracking",
        description:
          "Learn from top-performing content to improve future posts",
      },
    ],
    useCases: [
      {
        title: "Blog Writing",
        description: "Create comprehensive blog posts on any topic",
        example:
          "Generated a 2000-word article on 'AI in Marketing' with proper SEO optimization in under 5 minutes",
      },
      {
        title: "Social Media Posts",
        description: "Craft engaging posts for all major platforms",
        example:
          "Created a week's worth of Instagram captions with relevant hashtags and CTAs",
      },
      {
        title: "Email Campaigns",
        description: "Write compelling email copy that converts",
        example:
          "Drafted a product launch email series that achieved a 35% open rate",
      },
    ],
    capabilities: [
      { name: "Creative Writing", level: 5 },
      { name: "SEO Optimization", level: 4 },
      { name: "Brand Voice", level: 5 },
      { name: "Speed", level: 5 },
      { name: "Adaptability", level: 4 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Write a blog post about AI in marketing, around 1000 words",
        timestamp: "10:30 AM",
      },
      {
        sender: "agent",
        message:
          "I'll create that for you! What's your target audience and preferred tone? Professional, casual, or technical?",
        timestamp: "10:30 AM",
      },
      {
        sender: "user",
        message: "Professional tone for marketing managers",
        timestamp: "10:31 AM",
      },
      {
        sender: "agent",
        message:
          "Perfect! Here's your blog post: 'The AI Revolution in Marketing: How Automation is Transforming Customer Engagement'\n\nI've included sections on personalization, predictive analytics, and automation. The post is SEO-optimized with relevant keywords and includes a compelling CTA. Would you like me to adjust anything?",
        timestamp: "10:32 AM",
      },
    ],
    benefits: [
      "Save 10+ hours per week on content creation",
      "Maintain consistent brand voice across all channels",
      "Scale content production without additional resources",
      "Improve SEO rankings with optimized content",
    ],
  },
  {
    slug: "market-research",
    title: "Market Research Agent",
    tagline: "Uncover insights that drive decisions",
    description:
      "I dive deep into market trends and audience behavior. My goal is to uncover what truly resonates with your community.",
    longDescription:
      "The Market Research Agent analyzes vast amounts of data from multiple sources to provide actionable insights about your market, competitors, and target audience. It identifies trends, opportunities, and potential threats to help you make data-driven decisions.",
    features: [
      {
        icon: "📈",
        title: "Trend Analysis",
        description: "Identify emerging trends before your competitors",
      },
      {
        icon: "🎯",
        title: "Audience Insights",
        description: "Deep dive into customer behavior and preferences",
      },
      {
        icon: "🔍",
        title: "Competitor Monitoring",
        description: "Track competitor strategies and market positioning",
      },
      {
        icon: "📊",
        title: "Data Visualization",
        description: "Transform complex data into actionable reports",
      },
    ],
    useCases: [
      {
        title: "Market Entry Strategy",
        description: "Analyze new markets before expansion",
        example:
          "Provided comprehensive analysis of the European SaaS market, identifying 3 key opportunities",
      },
      {
        title: "Customer Segmentation",
        description: "Identify distinct customer groups and their needs",
        example:
          "Segmented audience into 5 personas with specific pain points and preferences",
      },
      {
        title: "Trend Forecasting",
        description: "Predict upcoming market shifts",
        example:
          "Identified the rise of AI tools 6 months before mainstream adoption",
      },
    ],
    capabilities: [
      { name: "Data Analysis", level: 5 },
      { name: "Trend Identification", level: 5 },
      { name: "Report Generation", level: 4 },
      { name: "Competitor Analysis", level: 4 },
      { name: "Insight Accuracy", level: 5 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "What are the latest trends in e-commerce?",
        timestamp: "2:15 PM",
      },
      {
        sender: "agent",
        message:
          "I've analyzed current market data. Here are the top 3 trends:\n\n1. Social Commerce - 67% YoY growth\n2. AI-powered personalization\n3. Sustainable shopping preferences\n\nWould you like a detailed report on any of these?",
        timestamp: "2:16 PM",
      },
      {
        sender: "user",
        message: "Yes, give me more details on social commerce",
        timestamp: "2:17 PM",
      },
      {
        sender: "agent",
        message:
          "Social commerce is exploding! Key insights:\n\n• 73% of consumers have purchased through social media\n• Instagram & TikTok lead with in-app checkout\n• Live shopping events see 30% conversion rates\n• Gen Z spends 2x more on social platforms\n\nI can create a full strategy document if you'd like.",
        timestamp: "2:18 PM",
      },
    ],
    benefits: [
      "Make data-driven decisions with confidence",
      "Stay ahead of market trends and competitors",
      "Identify untapped opportunities for growth",
      "Reduce research time from weeks to hours",
    ],
  },
  {
    slug: "persona-builder",
    title: "Persona Builder Agent",
    tagline: "Know your audience like never before",
    description:
      "I analyze your audience to build accurate personas. This helps ensure every message aligns with the right people.",
    longDescription:
      "The Persona Builder Agent creates detailed, data-driven customer personas by analyzing demographics, psychographics, behavior patterns, and pain points. These personas become the foundation of your marketing strategy, ensuring every campaign resonates with the right audience.",
    features: [
      {
        icon: "👥",
        title: "Demographic Analysis",
        description: "Age, location, income, education, and more",
      },
      {
        icon: "🧠",
        title: "Psychographic Profiling",
        description: "Values, interests, lifestyle, and motivations",
      },
      {
        icon: "💡",
        title: "Pain Point Identification",
        description: "Discover what keeps your audience up at night",
      },
      {
        icon: "🎯",
        title: "Journey Mapping",
        description: "Visualize the customer journey for each persona",
      },
    ],
    useCases: [
      {
        title: "Product Launch",
        description: "Create personas for new product targeting",
        example:
          "Built 4 distinct personas for a fitness app, leading to a 45% increase in conversion",
      },
      {
        title: "Content Strategy",
        description: "Tailor content to specific audience segments",
        example:
          "Developed persona-based content that doubled engagement rates",
      },
      {
        title: "Ad Targeting",
        description: "Optimize ad campaigns with precise targeting",
        example:
          "Reduced ad spend by 30% while increasing ROI through persona-based targeting",
      },
    ],
    capabilities: [
      { name: "Data Synthesis", level: 5 },
      { name: "Persona Accuracy", level: 5 },
      { name: "Insight Depth", level: 4 },
      { name: "Behavioral Analysis", level: 4 },
      { name: "Segmentation", level: 5 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Build a persona for a fitness app user",
        timestamp: "11:00 AM",
      },
      {
        sender: "agent",
        message:
          "I'll create a detailed persona! First, tell me about your app - what's the main feature or goal?",
        timestamp: "11:00 AM",
      },
      {
        sender: "user",
        message: "It's for busy professionals who want quick home workouts",
        timestamp: "11:02 AM",
      },
      {
        sender: "agent",
        message:
          "Perfect! Meet 'Active Alex':\n\n👤 Age: 28-35\n💼 Job: Mid-level professional\n⏰ Pain Point: No time for gym\n🎯 Goal: Stay fit with 20-min workouts\n📱 Tech-savvy, values efficiency\n💪 Motivated by progress tracking\n\nAlex works 50+ hours/week, wants results without gym commute. Prefers data-driven fitness and flexible scheduling.\n\nWant me to create more personas?",
        timestamp: "11:03 AM",
      },
    ],
    benefits: [
      "Target the right audience with precision",
      "Create more relevant and engaging content",
      "Improve conversion rates by 40% or more",
      "Build products that solve real problems",
    ],
  },
  {
    slug: "auto-posting",
    title: "Auto-Posting Agent",
    tagline: "Never miss a posting schedule again",
    description:
      "I automate your social media posting across all platforms. Schedule once, publish everywhere, at the perfect time.",
    longDescription:
      "The Auto-Posting Agent manages your entire social media calendar, automatically publishing content across multiple platforms at optimal times. It learns from engagement patterns to maximize reach and ensures consistent brand presence without manual effort.",
    features: [
      {
        icon: "🕒",
        title: "Smart Scheduling",
        description: "Post at times when your audience is most active",
      },
      {
        icon: "🌐",
        title: "Multi-Platform Support",
        description: "Instagram, Twitter, LinkedIn, Facebook, and more",
      },
      {
        icon: "🔄",
        title: "Content Adaptation",
        description: "Automatically formats content for each platform",
      },
      {
        icon: "📅",
        title: "Calendar View",
        description: "Visualize your entire content schedule at a glance",
      },
    ],
    useCases: [
      {
        title: "Consistent Posting",
        description: "Maintain regular presence across all channels",
        example:
          "Managed 30+ posts per week across 5 platforms with zero manual intervention",
      },
      {
        title: "Time Zone Optimization",
        description: "Reach global audiences at their peak times",
        example:
          "Increased international engagement by 85% through timezone-aware posting",
      },
      {
        title: "Campaign Automation",
        description: "Schedule entire campaigns in advance",
        example:
          "Automated a 3-month product launch campaign across all channels",
      },
    ],
    capabilities: [
      { name: "Automation", level: 5 },
      { name: "Multi-Platform", level: 5 },
      { name: "Timing Optimization", level: 5 },
      { name: "Reliability", level: 5 },
      { name: "Flexibility", level: 4 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Schedule this post for next week on all platforms",
        timestamp: "3:00 PM",
      },
      {
        sender: "agent",
        message:
          "Got it! I'll schedule your post for optimal times:\n\n• Instagram: Mon 9 AM\n• Twitter: Mon 11 AM\n• LinkedIn: Tue 8 AM\n• Facebook: Mon 7 PM\n\nBased on your audience data, these times have the highest engagement. Want to customize?",
        timestamp: "3:01 PM",
      },
      {
        sender: "user",
        message: "Looks perfect! Can you also post it on TikTok?",
        timestamp: "3:02 PM",
      },
      {
        sender: "agent",
        message:
          "Absolutely! I've added TikTok for Wednesday at 6 PM (peak time for your followers). I've also adapted the format for TikTok's vertical video style. All 5 platforms are now scheduled! 🎉",
        timestamp: "3:03 PM",
      },
    ],
    benefits: [
      "Save 15+ hours per week on manual posting",
      "Increase engagement with optimal timing",
      "Never miss a scheduled post again",
      "Maintain 24/7 social media presence",
    ],
  },
  {
    slug: "content-calendar",
    title: "Content Calendar Agent",
    tagline: "Strategic planning made effortless",
    description:
      "I create and manage your content calendar. From planning to execution, I ensure your content strategy stays on track.",
    longDescription:
      "The Content Calendar Agent is your strategic planning partner, creating comprehensive content calendars that align with your business goals, seasonal trends, and audience interests. It balances content types, maintains posting frequency, and ensures thematic consistency across all channels.",
    features: [
      {
        icon: "📆",
        title: "Strategic Planning",
        description: "Plan months ahead with data-driven content strategy",
      },
      {
        icon: "🎨",
        title: "Content Mix Balance",
        description:
          "Optimal blend of promotional, educational, and entertaining content",
      },
      {
        icon: "🎯",
        title: "Goal Alignment",
        description: "Every post supports your business objectives",
      },
      {
        icon: "🔔",
        title: "Deadline Reminders",
        description: "Never miss a content deadline with smart notifications",
      },
    ],
    useCases: [
      {
        title: "Quarterly Planning",
        description: "Map out entire quarters of content in hours",
        example:
          "Created a Q2 calendar with 120+ posts aligned with product launches",
      },
      {
        title: "Campaign Coordination",
        description: "Coordinate multi-channel campaigns seamlessly",
        example:
          "Orchestrated a product launch across 6 channels with perfect timing",
      },
      {
        title: "Content Gap Analysis",
        description: "Identify and fill content gaps automatically",
        example:
          "Discovered missing blog topics that increased organic traffic by 40%",
      },
    ],
    capabilities: [
      { name: "Strategic Planning", level: 5 },
      { name: "Organization", level: 5 },
      { name: "Trend Integration", level: 4 },
      { name: "Flexibility", level: 4 },
      { name: "Collaboration", level: 4 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Create a content calendar for Q1 2025",
        timestamp: "9:00 AM",
      },
      {
        sender: "agent",
        message:
          "I'll build your Q1 calendar! Quick questions:\n\n1. How many posts per week?\n2. Which platforms?\n3. Any key dates or launches?",
        timestamp: "9:01 AM",
      },
      {
        sender: "user",
        message:
          "3 posts per week, Instagram & LinkedIn. We have a product launch in February.",
        timestamp: "9:03 AM",
      },
      {
        sender: "agent",
        message:
          "Perfect! I've created your Q1 calendar:\n\n✅ 36 posts scheduled\n✅ Product launch campaign (4 weeks)\n✅ Mix: 40% educational, 30% promotional, 30% engaging\n✅ Key themes: Innovation, Customer Success, Industry Trends\n\nYour launch content builds from Jan (awareness) → Feb (launch) → Mar (testimonials). Ready to review?",
        timestamp: "9:05 AM",
      },
    ],
    benefits: [
      "Plan 3 months of content in under an hour",
      "Ensure strategic alignment across all content",
      "Maintain consistent posting frequency",
      "Adapt quickly to market changes",
    ],
  },
  {
    slug: "content-repurposer",
    title: "Content Repurposer Agent",
    tagline: "One piece of content, endless possibilities",
    description:
      "I transform your existing content into multiple formats. Turn a blog into tweets, videos into posts, and maximize every piece you create.",
    longDescription:
      "The Content Repurposer Agent maximizes the value of every piece of content by intelligently transforming it into multiple formats for different platforms. It extracts key insights, adapts messaging, and creates platform-specific variations that maintain your core message while optimizing for each channel's unique audience.",
    features: [
      {
        icon: "♻️",
        title: "Multi-Format Transformation",
        description:
          "Convert blogs to social posts, videos to articles, and more",
      },
      {
        icon: "🎯",
        title: "Platform Optimization",
        description: "Adapt content for each platform's best practices",
      },
      {
        icon: "📊",
        title: "Smart Extraction",
        description: "Identify and extract the most engaging snippets",
      },
      {
        icon: "⚡",
        title: "Rapid Creation",
        description: "Generate 10+ variations in minutes",
      },
    ],
    useCases: [
      {
        title: "Blog to Social",
        description: "Transform long-form content into social media posts",
        example:
          "Converted a 2000-word blog into 15 social posts across 4 platforms",
      },
      {
        title: "Webinar to Content Series",
        description: "Extract multiple content pieces from webinars",
        example: "Created 20+ pieces of content from a single 1-hour webinar",
      },
      {
        title: "Podcast to Articles",
        description: "Turn audio content into written formats",
        example:
          "Transformed a podcast episode into a blog, newsletter, and 10 tweets",
      },
    ],
    capabilities: [
      { name: "Content Analysis", level: 5 },
      { name: "Format Adaptation", level: 5 },
      { name: "Creativity", level: 4 },
      { name: "Efficiency", level: 5 },
      { name: "Quality Retention", level: 4 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Repurpose this blog post into social media content",
        timestamp: "1:30 PM",
      },
      {
        sender: "agent",
        message:
          "I'll extract the key insights and create multiple versions! What platforms do you need content for?",
        timestamp: "1:31 PM",
      },
      {
        sender: "user",
        message: "Twitter, LinkedIn, and Instagram",
        timestamp: "1:32 PM",
      },
      {
        sender: "agent",
        message:
          "Done! I've created:\n\n🐦 Twitter: 5 thread-worthy tweets\n💼 LinkedIn: 3 professional posts with insights\n📸 Instagram: 4 visual-friendly captions\n\nAll maintain your key message but optimized for each platform's audience. Plus, I've pulled out 10 engaging quotes for graphics. Want to see them?",
        timestamp: "1:33 PM",
      },
    ],
    benefits: [
      "Get 10x more content from existing assets",
      "Reduce content creation time by 70%",
      "Maintain consistency across all platforms",
      "Maximize ROI on every piece of content",
    ],
  },
  {
    slug: "copywriter",
    title: "Copywriter Agent",
    tagline: "Words that convert and captivate",
    description:
      "I write persuasive copy that drives action. From headlines to CTAs, I craft messages that resonate and convert.",
    longDescription:
      "The Copywriter Agent specializes in creating conversion-focused copy across all marketing materials. Using proven copywriting frameworks and psychological principles, it crafts compelling headlines, persuasive body copy, and irresistible calls-to-action that turn readers into customers.",
    features: [
      {
        icon: "💬",
        title: "Conversion-Focused",
        description: "Every word is chosen to drive specific actions",
      },
      {
        icon: "🧪",
        title: "A/B Test Variations",
        description: "Generate multiple versions for testing",
      },
      {
        icon: "🎭",
        title: "Tone Mastery",
        description: "From casual to corporate, perfect tone every time",
      },
      {
        icon: "🚀",
        title: "Framework-Based",
        description: "Uses proven formulas like AIDA, PAS, and FAB",
      },
    ],
    useCases: [
      {
        title: "Landing Pages",
        description: "Write high-converting landing page copy",
        example: "Created landing page copy that achieved 42% conversion rate",
      },
      {
        title: "Email Campaigns",
        description: "Craft emails that get opened and clicked",
        example: "Email sequence with 55% open rate and 12% click-through rate",
      },
      {
        title: "Ad Copy",
        description: "Write compelling ad copy that drives clicks",
        example:
          "Facebook ad copy that reduced CPC by 45% while increasing CTR",
      },
    ],
    capabilities: [
      { name: "Persuasion", level: 5 },
      { name: "Clarity", level: 5 },
      { name: "Creativity", level: 4 },
      { name: "Conversion Focus", level: 5 },
      { name: "Adaptability", level: 4 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Write a headline for our new productivity app",
        timestamp: "4:00 PM",
      },
      {
        sender: "agent",
        message:
          "I'd love to! What's the main benefit? What problem does it solve for users?",
        timestamp: "4:00 PM",
      },
      {
        sender: "user",
        message: "It helps teams collaborate better and saves time on meetings",
        timestamp: "4:02 PM",
      },
      {
        sender: "agent",
        message:
          "Here are 5 headline options:\n\n1. 'Cut Meeting Time by 50%. Boost Collaboration by 100%.'\n2. 'The Productivity App That Actually Saves Time'\n3. 'Less Meetings. More Progress. Better Results.'\n4. 'Stop Talking. Start Doing. Collaborate Smarter.'\n5. 'Transform Team Chaos into Coordinated Success'\n\nWhich direction resonates? I can refine any of these!",
        timestamp: "4:03 PM",
      },
    ],
    benefits: [
      "Increase conversion rates by up to 50%",
      "Save hours on writing and editing",
      "Test multiple variations quickly",
      "Maintain consistent brand voice",
    ],
  },
  {
    slug: "competitive-analysis",
    title: "Competitive Analysis Agent",
    tagline: "Know your competition inside out",
    description:
      "I monitor and analyze your competitors' strategies. Stay ahead with insights on their content, messaging, and market moves.",
    longDescription:
      "The Competitive Analysis Agent provides comprehensive intelligence on your competitors' marketing strategies, content performance, and market positioning. It continuously monitors competitor activities, identifies their strengths and weaknesses, and uncovers opportunities for differentiation.",
    features: [
      {
        icon: "🔍",
        title: "Continuous Monitoring",
        description: "24/7 tracking of competitor activities and changes",
      },
      {
        icon: "📊",
        title: "Performance Benchmarking",
        description: "Compare your metrics against competitors",
      },
      {
        icon: "💡",
        title: "Opportunity Identification",
        description: "Spot gaps in the market and competitive weaknesses",
      },
      {
        icon: "📈",
        title: "Trend Analysis",
        description: "Identify what's working for competitors and why",
      },
    ],
    useCases: [
      {
        title: "Market Positioning",
        description: "Understand where you stand in the competitive landscape",
        example:
          "Identified unique positioning that increased market share by 15%",
      },
      {
        title: "Content Strategy",
        description: "Learn from competitor successes and failures",
        example:
          "Discovered content gaps that led to 200% increase in organic traffic",
      },
      {
        title: "Product Development",
        description: "Identify unmet needs in the market",
        example:
          "Spotted feature gap that became our most-requested product update",
      },
    ],
    capabilities: [
      { name: "Data Collection", level: 5 },
      { name: "Pattern Recognition", level: 5 },
      { name: "Strategic Insight", level: 4 },
      { name: "Reporting", level: 4 },
      { name: "Accuracy", level: 5 },
    ],
    chatMockupData: [
      {
        sender: "user",
        message: "Run a complete competitive analysis for my brand.",
        timestamp: "10:00 AM",
      },
      {
        sender: "agent",
        message:
          "On it! Scanning the market to automatically identify your direct and indirect competitors...",
        timestamp: "10:01 AM",
      },
      {
        sender: "agent",
        message:
          "Analysis complete! I've identified and analyzed the top players in your space:",
        type: "competitor-analysis",
        competitors: [
          {
            name: "BMW",
            type: "direct",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
            strength: "Strong brand recognition and premium engineering image",
            weakness: "Higher maintenance costs compared to some rivals",
          },
          {
            name: "Mercedes-Benz",
            type: "direct",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
            strength: "Luxurious interiors and advanced safety technology",
            weakness: "Complex options raise price quickly",
          },
          {
            name: "Audi",
            type: "indirect",
            logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Audi_logo_detail.svg",
            strength: "Quattro AWD reputation and modern cabin tech",
            weakness: "Resale values can lag in some segments",
          },
        ],
        timestamp: "10:04 AM",
      },
      {
        sender: "agent",
        message:
          "I've compiled the full findings into a detailed report for you:",
        type: "download",
        downloadData: {
          filename: "Competitive_Analysis_Report.pdf",
          description:
            "Contains: Market share data, SWOT analysis, and strategic opportunities",
          size: "2.4 MB",
        },
        timestamp: "10:05 AM",
      },
    ],
    benefits: [
      "Make informed strategic decisions",
      "Identify market opportunities before competitors",
      "Avoid costly mistakes others are making",
      "Stay ahead of industry trends",
    ],
  },
];
