"use client";
import React, { useState } from "react";
import {
  Check,
  CreditCard,
  Search,
  Filter,
  Download,
  User,
  Users,
  Zap,
  BarChart3,
  Shield,
  Mail,
  MessageCircle,
  Database,
  Settings,
  Crown,
} from "lucide-react";

// ================== TYPES ==================
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

interface Plan {
  id: "basic" | "business" | "enterprise" | string;
  name: string;
  price: number;
  period: string;
  current: boolean;
  popular?: boolean;
  features: Feature[];
}

interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: "paid" | "unpaid";
}

interface PlanCardProps {
  plan: Plan;
}

interface InvoiceRowProps {
  invoice: Invoice;
  isSelected: boolean;
  onSelect: (invoiceId: string) => void;
}

// ================== DATA ==================
const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic plan",
    price: 10,
    period: "mth",
    current: true,
    features: [
      { icon: Check, text: "Access to all basic features" },
      { icon: BarChart3, text: "Basic reporting and analytics" },
      { icon: Users, text: "Up to 10 individual users" },
      { icon: Database, text: "20GB individual data each user" },
      { icon: MessageCircle, text: "Basic chat and email support" },
    ],
  },
  {
    id: "business",
    name: "Business plan",
    price: 20,
    period: "mth",
    current: false,
    popular: true,
    features: [
      { icon: Zap, text: "200+ integrations" },
      { icon: BarChart3, text: "Advanced reporting and analytics" },
      { icon: Users, text: "Up to 20 individual users" },
      { icon: Database, text: "40GB individual data each user" },
      { icon: Mail, text: "Priority chat and email support" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise plan",
    price: 40,
    period: "mth",
    current: false,
    features: [
      { icon: Settings, text: "Advanced custom fields" },
      { icon: Shield, text: "Audit log and data history" },
      { icon: Users, text: "Unlimited individual users" },
      { icon: Database, text: "Unlimited individual data" },
      { icon: Crown, text: "Personalised priority service" },
    ],
  },
];

const invoices: Invoice[] = [
  {
    id: "Invoice 0012",
    date: "12 Apr 2025",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
  {
    id: "Invoice 0011",
    date: "12 Mar 2025",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
  {
    id: "Invoice 0010",
    date: "12 Feb 2025",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
  {
    id: "Invoice 0009",
    date: "12 Jan 2025",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
  {
    id: "Invoice 0008",
    date: "12 Dec 2024",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
  {
    id: "Invoice 0007",
    date: "12 Nov 2024",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
  {
    id: "Invoice 0006",
    date: "12 Oct 2024",
    plan: "Basic plan",
    amount: "$10.00",
    status: "paid",
  },
];

// ================== COMPONENTS ==================
const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const getGradientColors = () => {
    if (plan.id === "basic")
      return "from-blue-500/20 to-cyan-500/20 border-amber-500/30";
    if (plan.id === "business")
      return "from-purple-500/20 to-pink-500/20 border-amber-500/30";
    if (plan.id === "enterprise")
      return "from-amber-500/20 to-orange-500/20 border-amber-500/30";
    return "from-slate-500/20 to-slate-500/20 border-slate-500/30";
  };

  const getIconColor = () => {
    if (plan.id === "basic") return "text-blue-400";
    if (plan.id === "business") return "text-purple-400";
    if (plan.id === "enterprise") return "text-amber-400";
    return "text-slate-400";
  };

  return (
    <div
      className={`relative rounded-xl border ${getGradientColors()} backdrop-blur-sm p-6 transition-all duration-300 hover:border-opacity-60`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">${plan.price}</span>
          <span className="text-slate-400 ml-1">/{plan.period}</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature: Feature, index: number) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <IconComponent className={`w-5 h-5 ${getIconColor()}`} />
              <span className="text-slate-300 text-sm">{feature.text}</span>
            </div>
          );
        })}
      </div>

      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
          plan.current
            ? "bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600/50"
            : plan.popular
            ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white shadow-lg"
            : "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white border border-slate-600/50"
        }`}
        disabled={plan.current}
      >
        {plan.current ? "Current plan" : "Switch to this plan"}
      </button>
    </div>
  );
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  invoice,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`flex items-center px-6 py-4 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors cursor-pointer ${
        isSelected ? "bg-slate-800/50" : ""
      }`}
    >
      <div className="flex items-center flex-1 space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(invoice.id)}
          className="w-4 h-4 rounded border-slate-600 bg-slate-700 focus:ring-2"
        />

        <div className="flex-1">
          <p className="text-white font-medium">{invoice.id}</p>
        </div>

        <div className="flex-1">
          <p className="text-slate-300">{invoice.date}</p>
        </div>

        <div className="flex-1">
          <p className="text-slate-300">{invoice.plan}</p>
        </div>

        <div className="flex-1">
          <p className="text-white font-medium">{invoice.amount}</p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              invoice.status === "paid"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {invoice.status}
          </span>
          <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ================== MAIN PAGE ==================
export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "archived">(
    "all"
  );
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInvoices(
      selectedInvoices.length === invoices.length
        ? []
        : invoices.map((invoice) => invoice.id)
    );
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <CreditCard className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Plans & billing
              </h1>
            </div>
          </div>
          <p className="text-slate-300">
            Manage your plan and billing history here.
          </p>
        </div>

        {/* Plans Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Previous Invoices Section */}
        <div className=" backdrop-blur-sm border border-slate-700/40 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/40">
            <h2 className="text-xl font-semibold text-white mb-4">
              Previous invoices
            </h2>

            {/* Filter Tabs and Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterTab === "all"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  View all
                </button>
                <button
                  onClick={() => setFilterTab("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterTab === "active"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterTab("archived")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterTab === "archived"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  Archived
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#eac565] focus:border-transparent"
                  />
                </div>

                {/* Sort */}
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors">
                  <Filter size={16} />
                  <span>Most recent</span>
                </button>
              </div>
            </div>
          </div>

          {/* Invoice List */}
          <div>
            {/* Header Row */}
            <div className="flex items-center px-6 py-3 border-b border-slate-700/30 bg-slate-800/20">
              <input
                type="checkbox"
                checked={selectedInvoices.length === invoices.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-2 mr-4"
              />
              <div className="flex-1 text-slate-400 text-sm font-medium">
                Invoice
              </div>
              <div className="flex-1 text-slate-400 text-sm font-medium">
                Date
              </div>
              <div className="flex-1 text-slate-400 text-sm font-medium">
                Plan
              </div>
              <div className="flex-1 text-slate-400 text-sm font-medium">
                Amount
              </div>
              <div className="w-24 text-slate-400 text-sm font-medium">
                Status
              </div>
            </div>

            {/* Invoice Rows */}
            <div className="max-h-96 overflow-y-auto">
              {filteredInvoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  isSelected={selectedInvoices.includes(invoice.id)}
                  onSelect={handleSelectInvoice}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">
                  No invoices found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
