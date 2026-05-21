"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

function InterviewWarningBanner({ plan, interviewCount, onUpgrade, isProPreview }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || plan !== "free" || interviewCount < 3) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/95 px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-medium text-amber-900">
          {isProPreview ? (
            <span>🎁 This is your Pro Preview interview &mdash; you&apos;ll get full detailed analysis this one time!</span>
          ) : (
            <span>You&apos;re on the Free plan &mdash; no detailed analysis will be generated. Interview limited to 3 minutes.</span>
          )}
          <button
            type="button"
            onClick={onUpgrade}
            className="ml-2 font-bold text-[#00BFA6] underline-offset-4 hover:underline"
          >
            Upgrade
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 text-amber-700 transition hover:bg-amber-100"
          aria-label="Dismiss warning"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default InterviewWarningBanner;
