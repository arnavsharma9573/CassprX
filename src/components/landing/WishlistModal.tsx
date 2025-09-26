import React, { useState } from "react";
import {
  Sparkles,
  Target,
  BarChart3,
  Clock,
  Users,
  PencilLine,
  ListRestart,
  Cpu,
  Loader2,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { joinWaitingList } from "@/services/comman-services";
import { toast } from "sonner";

interface WishListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  role: string;
  industry: string;
  teamSize: string;
  currentChallenges: string;
  interestedFeatures: string[];
}

const features = [
  {
    id: "content-generation",
    label: "Content Creator Agent",
    icon: Sparkles,
  },
  { id: "audience-insights", label: "Market Research Agent", icon: Users },
  {
    id: "automated-publishing",
    label: "Persona Builder Agent",
    icon: Clock,
  },
  {
    id: "campaign-analytics",
    label: "Auto-Posting Agent",
    icon: BarChart3,
  },
  {
    id: "gtm-strategy",
    label: "Content Calendar Agent",
    icon: Target,
  },
  {
    id: "contnet-repurposer",
    label: "Content Repurposer Agent",
    icon: ListRestart,
  },
  {
    id: "copywriter",
    label: "Copywriter Agent",
    icon: PencilLine,
  },
  {
    id: "competitive-analysis",
    label: "Competitve Analysis Agent",
    icon: Cpu,
  },
];

export default function WishList({ open, onOpenChange }: WishListProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    role: "",
    industry: "",
    teamSize: "",
    currentChallenges: "",
    interestedFeatures: [],
  });

  const [isloading, setIsLoading] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

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

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error(
        "Please fill out required fields (First Name, Last Name, Email)"
      );
      return;
    }

    try {
      setIsLoading(true);
      const res = await joinWaitingList(formData);
      if (
        res &&
        (res.message === "Already submitted" ||
          res.message === "User created successfully")
      ) {
        toast.success("🎉 You're in! We'll notify you as soon as we launch.", {
          description: "",
          duration: 2000,
        });
        onOpenChange(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Error submitting to waiting list:", error);
      toast.error("An error occurred while submitting to waiting list");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  const inputStyles = `
    w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-white placeholder-neutral-500
    focus:outline-none focus:border-[#eac565] focus:ring-1 focus:ring-[#eac565]
    transition-colors duration-200
  `;

  const selectStyles = `
    w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-white
    focus:outline-none focus:border-[#eac565] focus:ring-1 focus:ring-[#eac565]
    transition-colors duration-200 appearance-none cursor-pointer
  `;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm md:z-50">
        <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-black border border-neutral-800 rounded-lg overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">
                  Join the Waiting List
                </h2>
                <p className="text-neutral-400">
                  Be among the first to revolutionize your social media
                  strategy. Get early access and founder pricing!
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-800 text-neutral-200 border border-neutral-700">
                    <Target className="w-3 h-3 mr-1" />
                    Strategy Planning
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-800 text-neutral-200 border border-neutral-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Content Creation
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-800 text-neutral-200 border border-neutral-700">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics & Insights
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-200 mb-2 text-sm">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`${inputStyles} custom-input`}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-neutral-200 mb-2 text-sm">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`${inputStyles} custom-input`}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-neutral-200 mb-2 text-sm">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`${inputStyles} custom-input`}
                placeholder="john@company.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-neutral-200 mb-2 text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={`${inputStyles} custom-input`}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-200 mb-2 text-sm">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className={`${inputStyles} custom-input`}
                  placeholder="Company Inc."
                />
              </div>
              <div>
                <label className="block text-neutral-200 mb-2 text-sm">
                  Your Role
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className={`${selectStyles} custom-select`}
                  >
                    <option value="">Select role</option>
                    <option value="founder">Founder/CEO</option>
                    <option value="marketing-manager">Marketing Manager</option>
                    <option value="social-media-manager">
                      Social Media Manager
                    </option>
                    <option value="content-creator">Content Creator</option>
                    <option value="digital-marketer">Digital Marketer</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Industry & Team Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-200 mb-2 text-sm">
                  Industry
                </label>
                <div className="relative">
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    className={`${selectStyles} custom-select`}
                  >
                    <option value="">Select industry</option>
                    <option value="saas">SaaS</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="fintech">Fintech</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="consulting">Consulting</option>
                    <option value="agency">Marketing Agency</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-neutral-200 mb-2 text-sm">
                  Team Size
                </label>
                <div className="relative">
                  <select
                    value={formData.teamSize}
                    onChange={(e) =>
                      handleInputChange("teamSize", e.target.value)
                    }
                    className={`${selectStyles} custom-select`}
                  >
                    <option value="">Select size</option>
                    <option value="solo">Just me</option>
                    <option value="small">2-10 people</option>
                    <option value="medium">11-50 people</option>
                    <option value="large">51-200 people</option>
                    <option value="enterprise">200+ people</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Features Dropdown */}
            <div>
              <label className="block text-neutral-200 mb-2 text-sm">
                Which features interest you most?
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                  className="w-full p-3 bg-black border border-neutral-800 rounded-md text-left hover:bg-neutral-900 focus:outline-none focus:border-[#eac565] focus:ring-1 focus:ring-[#eac565] transition-colors duration-200"
                >
                  <div className="flex flex-wrap gap-1 min-h-[20px]">
                    {formData.interestedFeatures.length === 0 ? (
                      <span className="text-neutral-500">
                        Select one or more features...
                      </span>
                    ) : (
                      formData.interestedFeatures.map((featureId) => {
                        const feature = features.find(
                          (f) => f.id === featureId
                        );
                        return (
                          <span
                            key={featureId}
                            className="feature-badge px-2 py-1 rounded text-xs"
                          >
                            {feature?.label}
                          </span>
                        );
                      })
                    )}
                  </div>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                </button>

                {featuresDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-black border border-neutral-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      const isSelected = formData.interestedFeatures.includes(
                        feature.id
                      );
                      return (
                        <div
                          key={feature.id}
                          onClick={() => handleFeatureToggle(feature.id)}
                          className="flex items-center px-3 py-2 hover:bg-neutral-800 cursor-pointer"
                        >
                          <div className="flex items-center justify-center w-4 h-4 mr-2 border border-neutral-600 rounded">
                            {isSelected && (
                              <Check className="w-3 h-3 text-[#eac565]" />
                            )}
                          </div>
                          <Icon className="w-4 h-4 mr-2 text-neutral-400" />
                          <span className="text-white text-sm">
                            {feature.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-neutral-200 mb-2 text-sm">
                What's your biggest social media challenge?
              </label>
              <textarea
                value={formData.currentChallenges}
                onChange={(e) =>
                  handleInputChange("currentChallenges", e.target.value)
                }
                className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-[#eac565] focus:ring-1 focus:ring-[#eac565] transition-colors duration-200 custom-textarea min-h-[80px] resize-y"
                placeholder="Tell us about your current challenges..."
              />
            </div>

            {/* Submit Button */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  isloading
                }
                className="w-full bg-[#eac565] hover:bg-[#eac565]/90 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-900 font-semibold py-3 text-lg rounded-md transition-all hover:shadow-lg hover:shadow-[#eac565]/20 disabled:cursor-not-allowed"
              >
                {isloading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Joining...</span>
                  </div>
                ) : (
                  "Join Waitlist"
                )}
              </button>

              <p className="text-xs text-neutral-500 text-center">
                We'll never spam you. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
