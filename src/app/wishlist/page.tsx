"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function WishList() {
  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    role: string;
    industry: string;
    teamSize: string;
    currentChallenges: string;
    interestedFeatures: string[];
    monthlyBudget: string;
    timeline: string;
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    teamSize: "",
    currentChallenges: "",
    interestedFeatures: [],
    monthlyBudget: "",
    timeline: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      interestedFeatures: prev.interestedFeatures.includes(feature)
        ? prev.interestedFeatures.filter((f) => f !== feature)
        : [...prev.interestedFeatures, feature],
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const features = [
    {
      id: "content-generation",
      label: "AI Content Generation",
      icon: Sparkles,
    },
    { id: "audience-insights", label: "Audience Insights", icon: Users },
    { id: "automated-publishing", label: "Automated Publishing", icon: Clock },
    { id: "campaign-analytics", label: "Campaign Analytics", icon: BarChart3 },
    { id: "gtm-strategy", label: "Go-To-Market Strategy", icon: Target },
    {
      id: "performance-tracking",
      label: "Performance Tracking",
      icon: TrendingUp,
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-neutral-900" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You're In!</h2>
            <p className="text-neutral-400 mb-4">
              Thank you for joining our wishlist. We'll notify you as soon as we
              launch!
            </p>
            <div className="bg-neutral-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-neutral-300">
                🚀 Early access starting{" "}
                <span className="text-[#eac565] font-semibold">Q1 2025</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-[#eac565] mr-2" />
            <span className="text-sm text-neutral-300">Coming Soon</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block text-[#eac565]">Social Media Game</span>
          </h1>

          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Our platform turns your campaign ideas into ready-to-post social
            media content, audience insights, and automated publishing—all in a
            few clicks. All your Go-To-Market strategy, content, and publishing
            simplified, automated, and under one roof.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700"
            >
              <Target className="w-3 h-3 mr-1" />
              Strategy Planning
            </Badge>
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Content Creation
            </Badge>
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Analytics & Insights
            </Badge>
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700"
            >
              <Clock className="w-3 h-3 mr-1" />
              Automated Publishing
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Registration Form */}
          <Card className="bg-neutral-900 border-neutral-800 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white">
                Join the Wishlist
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Be among the first to revolutionize your social media strategy
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-neutral-200 mb-2 block"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-neutral-200 mb-2 block"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-neutral-200 mb-2 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="company"
                      className="text-neutral-200 mb-2 block"
                    >
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                      placeholder="Company Inc."
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="role"
                      className="text-neutral-200 mb-2 block"
                    >
                      Your Role
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="founder">Founder/CEO</SelectItem>
                        <SelectItem value="marketing-manager">
                          Marketing Manager
                        </SelectItem>
                        <SelectItem value="social-media-manager">
                          Social Media Manager
                        </SelectItem>
                        <SelectItem value="content-creator">
                          Content Creator
                        </SelectItem>
                        <SelectItem value="digital-marketer">
                          Digital Marketer
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="industry"
                      className="text-neutral-200 mb-2 block"
                    >
                      Industry
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("industry", value)
                      }
                    >
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="agency">Marketing Agency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="teamSize"
                      className="text-neutral-200 mb-2 block"
                    >
                      Team Size
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("teamSize", value)
                      }
                    >
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="solo">Just me</SelectItem>
                        <SelectItem value="small">2-10 people</SelectItem>
                        <SelectItem value="medium">11-50 people</SelectItem>
                        <SelectItem value="large">51-200 people</SelectItem>
                        <SelectItem value="enterprise">200+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-neutral-200 mb-3 block">
                    Which features interest you most?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      const isSelected = formData.interestedFeatures.includes(
                        feature.id
                      );
                      return (
                        <div
                          key={feature.id}
                          onClick={() => handleFeatureToggle(feature.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#eac565]/10 border-[#eac565] text-[#eac565]"
                              : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {feature.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="challenges"
                    className="text-neutral-200 mb-2 block"
                  >
                    What's your biggest social media challenge?
                  </Label>
                  <Textarea
                    id="challenges"
                    value={formData.currentChallenges}
                    onChange={(e) =>
                      handleInputChange("currentChallenges", e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565] min-h-[100px]"
                    placeholder="Tell us about your current challenges with social media marketing..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#eac565] hover:bg-[#eac565]/90 text-neutral-900 font-semibold py-3 text-lg transition-all hover:shadow-lg hover:shadow-[#eac565]/20"
                >
                  Join Wishlist
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-neutral-500 text-center">
                  We'll never spam you. Unsubscribe at any time.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Why Join Early?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#eac565] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Early Access</h4>
                      <p className="text-sm text-neutral-400">
                        Get exclusive access before public launch
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#eac565] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Founder Pricing
                      </h4>
                      <p className="text-sm text-neutral-400">
                        Lock in special pricing for life
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#eac565] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Shape the Product
                      </h4>
                      <p className="text-sm text-neutral-400">
                        Your feedback directly influences features
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#eac565] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">VIP Support</h4>
                      <p className="text-sm text-neutral-400">
                        Priority support and onboarding
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#eac565]/10 to-neutral-900 border-[#eac565]/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-[#eac565] mr-2" />
                  Launch Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#eac565] rounded-full"></div>
                    <div className="text-sm">
                      <span className="text-white font-medium">Q4 2024:</span>
                      <span className="text-neutral-300 ml-2">
                        Beta testing with select users
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#eac565] rounded-full"></div>
                    <div className="text-sm">
                      <span className="text-white font-medium">Q1 2025:</span>
                      <span className="text-neutral-300 ml-2">
                        Early access launch
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                    <div className="text-sm">
                      <span className="text-neutral-400 font-medium">
                        Q2 2025:
                      </span>
                      <span className="text-neutral-500 ml-2">
                        Public launch
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
