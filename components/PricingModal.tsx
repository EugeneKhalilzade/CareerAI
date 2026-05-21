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
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-8">
        {dismissible && (
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:opacity-90"
            aria-label="Close pricing modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            Simple pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose the right plan for your career growth
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Practice smarter and boost your confidence with AI-powered interviews.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-slate-100 p-1">
            {["monthly", "yearly"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setBilling(value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                  billing === value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
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
              className={`relative rounded-2xl bg-white p-6 shadow-sm ${
                plan.featured
                  ? "border-2 border-slate-900 shadow-slate-900/10"
                  : "border border-slate-200"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  Best Value
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-500">/{billing === "monthly" ? "mo" : "yr"}</span>
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{plan.description}</p>

              <ul className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={plan.current || loading}
                onClick={plan.featured ? upgradeToPro : undefined}
                className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : plan.current
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
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
