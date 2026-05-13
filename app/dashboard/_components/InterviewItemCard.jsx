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
      <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{interviewInfo?.jobPosition}</h2>
      <p className="mt-2 text-sm text-slate-600">
        {interviewInfo?.jobExperience} years experience
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
        <CalendarClock className="h-3.5 w-3.5" />
        Created on {interviewInfo.createdAt}
      </p>
      <div className="mt-4 flex gap-3">
        <Button size="sm" variant="outline" className="w-full" onClick={onFeedback}>
          View Feedback
        </Button>
        <Button size="sm" className="w-full" onClick={onStart}>
          Open Session
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
