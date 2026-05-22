"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

function PricingModal({ open, onClose, dismissible = true }) {
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const closeModal = () => {
    if (dismissible && onClose) onClose();
  };

  const upgradeToPro = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", billing }),
      });
      const data = await response.json().catch(() => ({}));

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for students just starting their job hunt journey.",
      features: ["3 AI interviews per month", "Basic behavioral questions", "General performance feedback"],
      cta: "Current Plan",
      current: true,
    },
    {
      name: "Pro",
      price: billing === "monthly" ? "$9" : "$90",
      description: "The ultimate package for serious job seekers ready to accelerate.",
      features: [
        "Unlimited AI interviews",
        "AI-tailored question types",
        "Detailed response analysis",
        "Strength & weakness mapping",
        "Priority 24/7 support",
        "Access to hidden job market tips",
      ],
      cta: "Upgrade to Pro",
      featured: true,
    },
    {
      name: "Team",
      price: billing === "monthly" ? "$25" : "$250",
      description: "Ideal for coaching businesses, bootcamps, and recruiting teams.",
      features: ["Everything in Pro", "Up to 10 team seats", "Admin dashboard & analytics", "Custom branded templates", "Bulk interview scheduling", "Dedicated account manager"],
      cta: "Get Started",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={closeModal}
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-cyan-500/20 bg-[#050510]/95 p-5 shadow-[0_0_50px_rgba(6,182,212,0.15)] sm:p-8">
        {dismissible && (
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 shadow-sm transition hover:bg-white/10 hover:text-white"
            aria-label="Close pricing modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            Simple pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Choose the right plan for your career growth
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Practice smarter and boost your confidence with AI-powered interviews.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-cyan-500/20 bg-white/[0.04] p-1">
            {["monthly", "yearly"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setBilling(value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                  billing === value
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.4)] transition-all duration-300 ${
                plan.featured
                  ? "border-2 border-purple-500 bg-[#080816]/95 shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                  : "border border-cyan-500/20 bg-[#080816]/80 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  Best Value
                </span>
              )}
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-400">/{billing === "monthly" ? "mo" : "yr"}</span>
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{plan.description}</p>

              <ul className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-purple-400" : "text-cyan-400"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={plan.current || loading}
                onClick={plan.featured ? upgradeToPro : undefined}
                className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  plan.featured
                    ? "bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border-0 hover:scale-[1.02] active:scale-[0.98]"
                    : plan.current
                      ? "cursor-not-allowed bg-white/5 text-slate-500 border border-white/5"
                      : "border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading && plan.featured ? "Opening checkout..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingModal;
