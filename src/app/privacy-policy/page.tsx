import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Header */}
      <div className="border-b border-neutral-800 md:mt-16 md:py-16">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last Updated: September 30, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Introduction */}
        <section>
          <p className="text-gray-300 leading-relaxed">
            At our AI Agent platform, we are committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your data when you use our AI agents, including Content
            Creator, Market Research, Persona Builder, Auto-Posting, Content
            Calendar, Content Repurposer, Copywriter, and Competitive Analysis
            agents.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Personal Information
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We collect your name, email address, company name, and payment
                information when you use our services. This information is
                necessary to provide you with our AI agent services and maintain
                your account.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Usage Data
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We collect information about how you interact with our AI
                agents, including content you create, research queries, personas
                built, and scheduling preferences. This helps us improve our
                services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Technical Data
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We collect technical information such as IP address, browser
                type, device information, and cookies to ensure security and
                platform performance.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            How We Use Your Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Service Delivery
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We use your information to deliver our AI agent services,
                including all content creation, analysis, and automation
                features.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Service Improvement
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your data helps us improve our AI models, develop new features,
                and enhance the accuracy of our agents.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Communication
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We may use your contact information to send service updates,
                feature announcements, and respond to your inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Data Security
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We implement industry-standard security measures to protect your
            data:
          </p>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                All data is encrypted using SSL/TLS protocols during
                transmission
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                Sensitive information is encrypted at rest using AES-256
                encryption
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                Strict access controls ensure only authorized personnel can
                access your data
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                Regular security audits and updates maintain the highest
                protection standards
              </span>
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Rights
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You have the following rights regarding your personal data:
          </p>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                <strong className="text-white">Access:</strong> Request a copy
                of all information we hold about you
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                <strong className="text-white">Correction:</strong> Request
                corrections to inaccurate information
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                <strong className="text-white">Deletion:</strong> Request
                deletion of your personal data at any time
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                <strong className="text-white">Opt-Out:</strong> Unsubscribe
                from marketing communications
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#EBA86D] mr-2">•</span>
              <span>
                <strong className="text-white">Portability:</strong> Receive
                your data in a machine-readable format
              </span>
            </li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We work with trusted third-party service providers for hosting,
            analytics, and payment processing. These providers are contractually
            obligated to protect your data. Our Auto-Posting Agent connects to
            social media platforms only with your authorization.
          </p>
          <p className="text-gray-400 leading-relaxed">
            <strong className="text-white">
              We never sell your personal information to third parties.
            </strong>
          </p>
        </section>

        {/* AI-Specific Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            AI-Specific Privacy
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Content Ownership
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All content created by our AI agents belongs to you. We do not
                claim ownership or use your generated content for other
                purposes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Training Data
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We may use aggregated, anonymized usage patterns to improve our
                AI models, but we never use your specific content or personal
                information for training without explicit consent.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#EBA86D] mb-2">
                Confidentiality
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your prompts, queries, and agent interactions are treated as
                confidential and protected from unauthorized access.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Cookies & Tracking
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We use cookies to maintain your session and improve your experience.
            You can manage cookie preferences through your browser settings.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            If you have questions about this Privacy Policy or wish to exercise
            your rights, please contact us at:
          </p>
          <p className="text-[#EBA86D]">privacy@yourdomain.com</p>
        </section>

        {/* Footer */}
        <section className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            By using our AI Agent platform, you acknowledge that you have read
            and understood this Privacy Policy and agree to its terms.
          </p>
        </section>
      </div>
    </div>
  );
}
