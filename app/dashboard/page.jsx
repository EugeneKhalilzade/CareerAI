"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Target } from "lucide-react";
import AddNewInterview from "./_components/AddNewInterview";
import Interviewlist from "./_components/Interviewlist";
import ResumeTailor from "./_components/ResumeTailor";
import WeeklyPerformanceChart from "./_components/WeeklyPerformanceChart";
import PricingModal from "@/components/PricingModal";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

function Dashboard() {
  const { user } = useUser();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [interviewCount, setInterviewCount] = useState(0);
  const plan = user?.publicMetadata?.plan || "free";

  useEffect(() => {
    if (user) GetCompletedInterviewCount();
  }, [user]);

  const GetCompletedInterviewCount = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));
    const count = [...new Set(result.map((item) => item.mockIdRef))].length;
    const dismissed = sessionStorage.getItem("karyerai-pricing-dismissed-after-three");

    setInterviewCount(count);
    setShowPricingModal(plan === "free" && count >= 3 && count <= 5 && dismissed !== "true");
  };

  const closePricingModal = () => {
    sessionStorage.setItem("karyerai-pricing-dismissed-after-three", "true");
    setShowPricingModal(false);
  };

  return (
    <div className="space-y-8">
      <PricingModal
        open={showPricingModal}
        onClose={closePricingModal}
        dismissible={interviewCount >= 3 && interviewCount <= 5}
      />

      <section className="glass-card p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Target className="h-4 w-4" />
          Interview mission control
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white">Welcome to your dashboard</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Build interviews for each job you target, answer out loud, and improve
          faster with guided AI feedback.
        </p>
      </section>

      <WeeklyPerformanceChart />

      <section id="new-interview" className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold">Create a new interview</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <AddNewInterview />
          <ResumeTailor />
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white">Tips for better results</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Add your exact role, key technologies, and realistic experience level.
            This helps CareerAI generate questions that match your real interview loop.
          </p>
        </div>
      </section>

      <div id="interview-history">
        <Interviewlist />
      </div>
    </div>
  );
}

export default Dashboard;
