"use client";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import React from "react";

function InterviewItemCard({ interviewInfo }) {
  const router = useRouter();
  const onStart = () => {
    router.push(`/dashboard/interview/${interviewInfo?.mockId}`);
  };
  const onFeedback = () => {
    router.push(`/dashboard/interview/${interviewInfo.mockId}/feedback`);
  };
  return (
    <div className="glass-card p-5">
      <h2 className="line-clamp-2 text-lg font-semibold text-white">{interviewInfo?.jobPosition}</h2>
      <p className="mt-2 text-sm text-slate-400">
        {interviewInfo?.jobExperience} years experience
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs text-cyan-500/70">
        <CalendarClock className="h-3.5 w-3.5" />
        Created on {interviewInfo.createdAt}
      </p>
      <div className="mt-4 flex gap-3">
        <Button
          size="sm"
          variant="outline"
          className="w-full border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
          onClick={onFeedback}
        >
          View Feedback
        </Button>
        <Button size="sm" className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] border-0" onClick={onStart}>
          Open Session
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
