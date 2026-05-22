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
      <p className="mt-2 text-sm text-[#b6a66d]">
        {interviewInfo?.jobExperience} years experience
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs text-[#a08c4a]">
        <CalendarClock className="h-3.5 w-3.5" />
        Created on {interviewInfo.createdAt}
      </p>
      <div className="mt-4 flex gap-3">
        <Button
          size="sm"
          variant="outline"
          className="w-full border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10"
          onClick={onFeedback}
        >
          View Feedback
        </Button>
        <Button size="sm" className="w-full bg-[#d4af37] text-[#06180d] hover:bg-[#f3d76b]" onClick={onStart}>
          Open Session
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
