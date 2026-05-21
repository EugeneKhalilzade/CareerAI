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
      <div className="border-b border-teal-100 bg-[#FDF0F0]/95">
        <div className="page-shell flex flex-col gap-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-700">
            Free plan: {interviewCount}/5 interviews used. Upgrade for unlimited interviews and full analysis.
          </p>
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#00BFA6] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
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
