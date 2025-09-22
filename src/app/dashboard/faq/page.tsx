import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";

export default function FAQPage() {
  return (
    <div className="p-8 text-white grid md:grid-cols-2 gap-12 items-start">
      {/* Left Side: Header + Description */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-neutral-300 mt-3 leading-relaxed">
          Using CassprX? We’re here to help. If you have any questions or need
          help, please don’t hesitate to reach out to us.
        </p>
      </div>

      {/* Right Side: Contact Form */}
      <Card className="bg-neutral-900 border border-neutral-700 shadow-md">
        <CardContent className="p-6">
          <form className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Your Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {[
                "Billing & plans",
                "Connections",
                "Sign in & up",
                "Channels",
                "Notifications",
                "Mobile experience",
                "Workspace managing",
              ].map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  variant="outline"
                  className="border-neutral-700 text-white hover:bg-neutral-700 hover:text-white"
                >
                  {topic}
                </Button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <span className="flex-1 border-t border-neutral-700" />
              OR
              <span className="flex-1 border-t border-neutral-700" />
            </div>

            {/* Custom Topic */}
            <div className="flex flex-col gap-2">
              <label htmlFor="topic" className="text-sm font-medium text-white">
                Can’t find above? Tell us below:
              </label>
              <input
                id="topic"
                type="text"
                placeholder="Enter your topic"
                className="bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 rounded-md px-3 py-2"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-neutral-200"
            >
              Send your request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
