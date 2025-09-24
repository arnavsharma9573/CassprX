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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  Users,
  X,
  Check,
  PencilLine,
  ListRestart,
  Cpu, // Added for the multi-select dropdown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

interface WishListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WishList({ open, onOpenChange }: WishListProps) {
  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string; // <<< MODIFICATION: Added phone number field
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
    phoneNumber: "", // <<< MODIFICATION: Initialized phone number
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

  const handleSubmit = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error(
        "Please fill out required fields (First Name, Last Name, Email)"
      );
      return;
    }

    // Show success toast
    toast.success("🎉 You're in! We'll notify you as soon as we launch.", {
      description: "",
      duration: 2000, // auto-dismiss after 3 seconds
    });
    onOpenChange(false);
    // Reset form after submit
    setFormData({
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
      monthlyBudget: "",
      timeline: "",
    });
  };
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] md:max-w-[900px] overflow-y-auto bg-neutral-900 border-neutral-800 text-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            {/* <Sparkles className="w-6 h-6 text-[#eac565] mr-2" /> */}
            Join the Waiting List
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Be among the first to revolutionize your social media strategy. Get
            early access and founder pricing!
          </DialogDescription>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700 text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              Strategy Planning
            </Badge>
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Content Creation
            </Badge>
            <Badge
              variant="secondary"
              className="bg-neutral-800 text-neutral-200 border-neutral-700 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Analytics & Insights
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-neutral-200 mb-2 block">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-neutral-200 mb-2 block">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
              placeholder="john@company.com"
            />
          </div>

          {/* <<< MODIFICATION START: Added Phone Number Input >>> */}
          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-neutral-200 mb-2 block"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          {/* <<< MODIFICATION END: Added Phone Number Input >>> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-neutral-200 mb-2 block">
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565]"
                placeholder="Company Inc."
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-neutral-200 mb-2 block">
                Your Role
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry" className="text-neutral-200 mb-2 block">
                Industry
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("industry", value)}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
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
              <Label htmlFor="teamSize" className="text-neutral-200 mb-2 block">
                Team Size
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("teamSize", value)}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
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
            <Label className="text-neutral-200 mb-2 block">
              Which features interest you most?
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-800 hover:text-white h-auto min-h-10"
                >
                  <div className="flex flex-wrap gap-1">
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
                          <Badge
                            key={featureId}
                            variant="secondary"
                            className="bg-[#eac565]/20 border border-transparent text-[#eac565] py-1 pointer-events-none"
                          >
                            {feature?.label}
                          </Badge>
                        );
                      })
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] bg-neutral-800 border-neutral-700 text-white"
              >
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <DropdownMenuCheckboxItem
                      key={feature.id}
                      checked={formData.interestedFeatures.includes(feature.id)}
                      onCheckedChange={() => {
                        handleFeatureToggle(feature.id);
                      }}
                      onSelect={(e) => e.preventDefault()} // This is key to keep the menu open
                      className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{feature.label}</span>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <Label htmlFor="challenges" className="text-neutral-200 mb-2 block">
              What's your biggest social media challenge?
            </Label>
            <Textarea
              id="challenges"
              value={formData.currentChallenges}
              onChange={(e) =>
                handleInputChange("currentChallenges", e.target.value)
              }
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-[#eac565] min-h-[80px]"
              placeholder="Tell us about your current challenges..."
            />
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.firstName || !formData.lastName || !formData.email
              }
              className="w-full bg-[#eac565] hover:bg-[#eac565]/90 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-900 font-semibold py-3 text-lg transition-all hover:shadow-lg hover:shadow-[#eac565]/20"
            >
              Join Wishlist
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-neutral-500 text-center">
              We'll never spam you. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
