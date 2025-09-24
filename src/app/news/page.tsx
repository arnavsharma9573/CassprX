"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  TrendingUp,
  Users,
  Zap,
  Award,
  Globe,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Product Updates",
    "Company News",
    "Partnerships",
    "Awards",
    "Industry Insights",
  ];

  const newsArticles = [
    {
      id: 1,
      title: "AI-Powered Content Generation Reaches 1 Million Posts Created",
      excerpt:
        "Our platform has officially crossed the milestone of generating over 1 million social media posts for organizations worldwide.",
      content:
        "This incredible achievement represents the growing trust organizations place in AI-powered content creation...",
      category: "Company News",
      date: "2024-03-15",
      readTime: "3 min read",
      image: "/api/placeholder/600/300",
      featured: true,
      tags: ["Milestone", "AI", "Growth"],
    },
    {
      id: 2,
      title: "Strategic Partnership with Leading Marketing Automation Platform",
      excerpt:
        "We are excited to announce our integration with a major marketing automation platform to streamline workflows.",
      content:
        "This partnership will enable seamless data flow between platforms, making campaign management even more efficient...",
      category: "Partnerships",
      date: "2024-03-12",
      readTime: "2 min read",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Partnership", "Integration", "Marketing"],
    },
    {
      id: 3,
      title: "New Advanced Analytics Dashboard Launched",
      excerpt:
        "Introducing comprehensive analytics that provide deeper insights into your social media performance.",
      content:
        "Our new dashboard features real-time metrics, predictive analytics, and custom reporting capabilities...",
      category: "Product Updates",
      date: "2024-03-10",
      readTime: "4 min read",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Analytics", "Dashboard", "Features"],
    },
    {
      id: 4,
      title: "Winner: Best AI Marketing Tool of 2024",
      excerpt:
        "We are honored to receive the prestigious AI Marketing Tool award from the Global Marketing Association.",
      content:
        "This recognition validates our commitment to innovation and excellence in AI-powered marketing solutions...",
      category: "Awards",
      date: "2024-03-08",
      readTime: "2 min read",
      image: "/api/placeholder/600/300",
      featured: true,
      tags: ["Award", "Recognition", "AI"],
    },
    {
      id: 5,
      title: "Multi-Language Support Now Available",
      excerpt:
        "Generate content in over 25 languages to reach global audiences with localized messaging.",
      content:
        "Our AI now supports content generation in multiple languages, maintaining context and cultural nuances...",
      category: "Product Updates",
      date: "2024-03-05",
      readTime: "3 min read",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Multilingual", "Global", "Features"],
    },
    {
      id: 6,
      title: "The Future of AI in Social Media Marketing",
      excerpt:
        "Exploring upcoming trends and innovations that will shape the social media marketing landscape.",
      content:
        "Industry experts predict significant changes in how AI will transform social media marketing strategies...",
      category: "Industry Insights",
      date: "2024-03-01",
      readTime: "5 min read",
      image: "/api/placeholder/600/300",
      featured: false,
      tags: ["Trends", "Future", "AI", "Marketing"],
    },
  ];

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find((article) => article.featured);
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <motion.section
        className="relative pt-20 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-6">
          <BackgroundRippleEffect rows={15} />
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2  border border-neutral-700 rounded-full mb-8"
              variants={itemVariants}
            >
              <TrendingUp
                className="w-4 h-4 mr-2"
                style={{ color: "#eac565" }}
              />
              <span className="text-sm text-neutral-300">Latest Updates</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Company
              <span className="block" style={{ color: "#eac565" }}>
                News & Updates
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-neutral-300 mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Stay updated with the latest developments, product launches,
              partnerships, and insights from our journey in revolutionizing
              social media marketing.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <motion.section
        className="py-12 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search news and updates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none transition-colors"
                  style={
                    { "--focus-border-color": "#eac565" } as React.CSSProperties
                  }
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.currentTarget.style.borderColor = "#eac565")
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.currentTarget.style.borderColor = "#525252")
                  }
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-neutral-700 border border-neutral-600 rounded-xl text-white transition-colors appearance-none cursor-pointer"
                  style={
                    { "--focus-border-color": "#eac565" } as React.CSSProperties
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#eac565")}
                  onBlur={(e) => (e.target.style.borderColor = "#525252")}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 z-50 ${
                    selectedCategory === category
                      ? "text-neutral-900"
                      : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                  }`}
                  style={
                    selectedCategory === category
                      ? { backgroundColor: "#eac565" }
                      : {}
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Article */}
      <AnimatePresence mode="wait">
        {featuredArticle && (
          <motion.section
            className="py-16 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            key={featuredArticle.id}
          >
            <div className="container mx-auto px-6">
              <motion.div
                className="max-w-7xl mx-auto"
                variants={cardHoverVariants}
                whileHover="hover"
              >
                <div className="bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-3xl overflow-hidden border border-neutral-600">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Award
                          className="w-5 h-5"
                          style={{ color: "#eac565" }}
                        />
                        <span
                          className="font-semibold text-sm"
                          style={{ color: "#eac565" }}
                        >
                          Featured Story
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>

                      <div className="flex items-center gap-6 mb-8 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredArticle.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {featuredArticle.readTime}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {featuredArticle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-neutral-600 text-neutral-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <motion.button
                        className="group text-neutral-900 px-8 py-4 rounded-xl font-semibold transition-colors flex items-center w-fit"
                        style={{ backgroundColor: "#eac565" }}
                        whileHover={{ x: 5 }}
                        onMouseEnter={(e) =>
                          ((
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = "#d4b355")
                        }
                        onMouseLeave={(e) =>
                          ((
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = "#eac565")
                        }
                      >
                        Read Full Story
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>

                    <div className="relative h-64 lg:h-full min-h-[400px]">
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-r-3xl"
                        style={{
                          background: `linear-gradient(to bottom right, #eac565, transparent)`,
                        }}
                      />
                      <div className="w-full h-full bg-neutral-600 rounded-r-3xl flex items-center justify-center">
                        <Globe
                          className="w-20 h-20 opacity-50"
                          style={{ color: "#eac565" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* News Grid */}
      <section className="py-16 ">
        <div className="container max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="group  border border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300"
                  style={
                    { "--focus-border-color": "#eac565" } as React.CSSProperties
                  }
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.borderColor = "#eac565")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.borderColor = "#404040")
                  }
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  layout
                >
                  <div className="relative h-48 bg-neutral-600 flex items-center justify-center">
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-10"
                      style={{
                        background: `linear-gradient(to bottom right, #eac565, transparent)`,
                      }}
                    />
                    {article.category === "Product Updates" && (
                      <Zap
                        className="w-12 h-12 opacity-50"
                        style={{ color: "#eac565" }}
                      />
                    )}
                    {article.category === "Company News" && (
                      <Users
                        className="w-12 h-12 opacity-50"
                        style={{ color: "#eac565" }}
                      />
                    )}
                    {article.category === "Partnerships" && (
                      <Globe
                        className="w-12 h-12 opacity-50"
                        style={{ color: "#eac565" }}
                      />
                    )}
                    {article.category === "Awards" && (
                      <Award
                        className="w-12 h-12 opacity-50"
                        style={{ color: "#eac565" }}
                      />
                    )}
                    {article.category === "Industry Insights" && (
                      <TrendingUp
                        className="w-12 h-12 opacity-50"
                        style={{ color: "#eac565" }}
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4" style={{ color: "#eac565" }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#eac565" }}
                      >
                        {article.category}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-semibold text-white mb-3 leading-tight transition-colors group-hover:text-white"
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#eac565")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "white")
                      }
                    >
                      {article.title}
                    </h3>

                    <p className="text-neutral-400 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-neutral-700 text-neutral-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      className="font-medium text-sm flex items-center transition-colors"
                      style={{ color: "#eac565" }}
                      whileHover={{ x: 3 }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#d4b355")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "#eac565")
                      }
                    >
                      Read More
                      <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredArticles.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-20 h-20  rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No articles found
              </h3>
              <p className="text-neutral-400">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <motion.section
        className="py-16 bg-neutral-950"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay In The Loop
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Get the latest company news, product updates, and industry insights
            delivered to your inbox.
          </p>

          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-neutral-600 border border-neutral-500 rounded-xl text-white placeholder-neutral-400 transition-colors"
              style={
                { "--focus-border-color": "#eac565" } as React.CSSProperties
              }
              onFocus={(e) => (e.target.style.borderColor = "#eac565")}
              onBlur={(e) => (e.target.style.borderColor = "#737373")}
            />
            <motion.button
              className="text-neutral-900 px-6 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: "#eac565" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#d4b355")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#eac565")
              }
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
