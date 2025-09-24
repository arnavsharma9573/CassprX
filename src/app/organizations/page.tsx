import { Navbar } from "@/components/landing/Navbar";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React from "react";
import {
  ArrowRight,
  Users,
  Zap,
  BarChart3,
  Calendar,
  Shield,
  Globe,
  Target,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import FadingSentences from "@/components/landing/FadingSentences";

export default function OrganizationPage() {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Campaign Strategy",
      description:
        "Transform your campaign ideas into comprehensive Go-To-Market strategies with AI-powered insights.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automated Content Creation",
      description:
        "Generate ready-to-post social media content across all platforms in just a few clicks.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Audience Insights",
      description:
        "Deep audience analytics and targeting recommendations to maximize your campaign reach.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Publishing",
      description:
        "Automated scheduling and publishing across all your social media channels.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Brand Consistency",
      description:
        "Maintain consistent brand voice and visual identity across all your content.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Platform Support",
      description:
        "Seamless integration with all major social media platforms and marketing tools.",
    },
  ];

  const benefits = [
    "Reduce content creation time by 90%",
    "Increase engagement rates by up to 300%",
    "Streamline your entire marketing workflow",
    "Scale your social media presence effortlessly",
    "Get data-driven campaign recommendations",
    "Maintain consistent brand messaging",
  ];

  const plans = [
    {
      name: "Startup",
      price: "$49",
      period: "/month",
      description: "Perfect for small organizations getting started",
      features: [
        "Up to 5 team members",
        "3 social media accounts",
        "100 AI-generated posts/month",
        "Basic analytics",
        "Email support",
      ],
      highlighted: false,
    },
    {
      name: "Growth",
      price: "$149",
      period: "/month",
      description: "Ideal for growing organizations",
      features: [
        "Up to 20 team members",
        "10 social media accounts",
        "500 AI-generated posts/month",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited team members",
        "Unlimited social accounts",
        "Unlimited AI content",
        "Custom integrations",
        "Dedicated account manager",
        "White-label solution",
      ],
      highlighted: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <section>
        <Navbar />
      </section>

      {/* Hero Section with Background Ripple */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <BackgroundRippleEffect rows={15} />
        <div className="relative z-10 container mx-auto px-6 pt-19 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 border border-neutral-700 rounded-full mb-8">
              <Users className="w-4 h-4 mr-2 text-[#eac565]" />
              <span className="text-sm text-neutral-300">
                Built for Organizations
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Scale Your
              <span className="block bg-gradient-to-r from-[#E6A550] to-[#e3a554] bg-clip-text text-transparent">
                Social Media Empire
              </span>
            </h1>

            <FadingSentences />

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-[#eac565] text-neutral-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#d4b355] transition-all duration-300 flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-neutral-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-800 transition-all duration-300">
                Schedule Demo
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span className="text-neutral-400 text-sm">
                Trusted by 10,000+ organizations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="text-[#eac565]"> Dominate Social Media</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              From strategy to execution, our comprehensive platform handles
              every aspect of your social media marketing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-neutral-800 border border-neutral-700 p-8 rounded-2xl hover:border-[#eac565]/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-[#eac565]/10 rounded-xl flex items-center justify-center text-[#eac565] mb-6 group-hover:bg-[#eac565]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Why Organizations
                <span className="block text-[#eac565]">
                  Choose Our Platform
                </span>
              </h2>
              <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
                Join thousands of organizations who have transformed their
                social media presence and achieved unprecedented growth with our
                AI-powered platform.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#eac565] flex-shrink-0" />
                    <span className="text-neutral-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <button className="mt-8 bg-[#eac565] text-neutral-900 px-8 py-4 rounded-xl font-semibold hover:bg-[#d4b355] transition-colors flex items-center">
                See Success Stories
                <Rocket className="ml-2 w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#eac565]/20 to-neutral-700/20 p-8 rounded-3xl border border-neutral-600">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl">
                    <span className="text-neutral-300">
                      Campaign Performance
                    </span>
                    <span className="text-[#eac565] font-semibold">+247%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl">
                    <span className="text-neutral-300">
                      Content Creation Speed
                    </span>
                    <span className="text-[#eac565] font-semibold">
                      10x Faster
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl">
                    <span className="text-neutral-300">Team Productivity</span>
                    <span className="text-[#eac565] font-semibold">+180%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl">
                    <span className="text-neutral-300">ROI Improvement</span>
                    <span className="text-[#eac565] font-semibold">+320%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your
              <span className="text-[#eac565]"> Growth Plan</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Flexible pricing designed to scale with your organization's needs
              and ambitions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-[#eac565]/10 to-neutral-800 border-[#eac565]"
                    : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#eac565] text-neutral-900 px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-neutral-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-neutral-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#eac565] flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-[#eac565] text-neutral-900 hover:bg-[#d4b355]"
                      : "bg-neutral-700 text-white hover:bg-neutral-600"
                  }`}
                >
                  {plan.price === "Custom"
                    ? "Contact Sales"
                    : "Start Free Trial"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r  py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block text-[#eac565]">Social Media Strategy?</span>
          </h2>
          <p className="text-xl text-neutral-300 mb-12 max-w-3xl mx-auto">
            Join thousands of organizations who have already revolutionized
            their social media presence. Start your free trial today and see the
            difference AI-powered automation can make.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-[#eac565] text-neutral-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#d4b355] transition-all duration-300 flex items-center">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-neutral-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-800 transition-all duration-300">
              Book a Demo
            </button>
          </div>

          <p className="text-neutral-400 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
