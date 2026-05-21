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
      <div className="border-b border-slate-200/70 bg-white/90">
        <div className="page-shell flex flex-col gap-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="font-medium text-slate-700">
              Free plan: {interviewCount}/{limit} interviews used. Upgrade for unlimited interviews and full analysis.
            </p>
            <div className="h-2 w-full rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {Math.max(limit - interviewCount, 0)} interviews remaining this month.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
