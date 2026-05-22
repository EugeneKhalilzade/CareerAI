"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

function InterviewWarningBanner({ plan, interviewCount, onUpgrade, isProPreview }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || plan !== "free" || interviewCount < 3) return null;

  return (
    <div className="rounded-2xl border border-[#d4af37]/20 bg-[#0d2a18]/80 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-medium text-[#f5f0e8]">
          {isProPreview ? (
            <span>🎁 This is your Pro Preview interview &mdash; you&apos;ll get full detailed analysis this one time!</span>
          ) : (
            <span>You&apos;re on the Free plan &mdash; no detailed analysis will be generated. Interview limited to 3 minutes.</span>
          )}
          <button
            type="button"
            onClick={onUpgrade}
            className="ml-2 font-bold text-[#d4af37] underline-offset-4 hover:underline"
          >
            Upgrade
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 text-[#d4af37] transition hover:bg-white/5"
          aria-label="Dismiss warning"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default InterviewWarningBanner;
