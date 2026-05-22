"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowUpRight } from "lucide-react";
import PricingModal from "@/components/PricingModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

function UpgradeBanner() {
  const { user } = useUser();
  const [interviewCount, setInterviewCount] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const plan = user?.publicMetadata?.plan || "free";
  const limit = 5;
  const percent = Math.min((interviewCount / limit) * 100, 100);

  useEffect(() => {
    if (user && plan === "free") {
      GetInterviewCount();
    }
  }, [user, plan]);

  const GetInterviewCount = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));
    setInterviewCount([...new Set(result.map((item) => item.mockIdRef))].length);
  };

  if (!user || plan !== "free") return null;

  return (
    <>
      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        dismissible
      />
      <div className="border-b border-cyan-500/20 bg-[#050510]/90 backdrop-blur-xl">
        <div className="page-shell flex flex-col gap-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="font-medium text-white">
              Free plan: {interviewCount}/{limit} interviews used. Upgrade for unlimited interviews and full analysis.
            </p>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {Math.max(limit - interviewCount, 0)} interviews remaining this month.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] transition border-0"
          >
            Upgrade to Pro
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export default UpgradeBanner;
