"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Share2,
  Copy,
  CheckCheck,
  Star,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PricingModal from "@/components/PricingModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDownIcon } from "lucide-react";

// ── Rating badge ──────────────────────────────────────────────────────────────
function RatingBadge({ rating }) {
  const n = Number(rating);
  const color =
    n >= 8 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : n >= 5 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-rose-100 text-rose-700 border-rose-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${color}`}>
      <Star className="h-3 w-3 fill-current" />
      {rating}/10
    </span>
  );
}

// ── Share modal ───────────────────────────────────────────────────────────────
function ShareModal({ interviewId, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${interviewId}`
      : `/share/${interviewId}`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <Share2 className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Share feedback</h2>
            <p className="text-xs text-slate-500">Anyone with this link can view your results</p>
          </div>
        </div>

        {/* URL row */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="flex-1 truncate text-sm text-slate-600">{shareUrl}</span>
          <button
            onClick={copy}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700"
          >
            {copied ? (
              <><CheckCheck className="h-3.5 w-3.5" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy link</>
            )}
          </button>
        </div>

        {/* Preview chip */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 p-3">
          <ArrowUpRight className="h-4 w-4 text-violet-500 shrink-0" />
          <p className="text-xs text-violet-700">
            The shared page is public and shows your questions, answers, and AI feedback — but <strong>never</strong> your email or personal info.
          </p>
        </div>

        {/* Open in new tab */}
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full rounded-xl">
              <ArrowUpRight className="mr-1.5 h-4 w-4" /> Open preview
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main feedback page ────────────────────────────────────────────────────────
function Feedback({ params }) {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState();
  const [showShare, setShowShare] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingDismissible, setPricingDismissible] = useState(true);
  const [isProPreview, setIsProPreview] = useState(false);
  const plan = user?.publicMetadata?.plan || "free";
  const hasFullAccess = plan !== "free" || isProPreview;

  useEffect(() => {
    GetFeedBack();
  }, []);

  useEffect(() => {
    const previewFromUrl = searchParams.get("proPreview") === "true";
    const previewFromSession = sessionStorage.getItem("karyerai-pro-preview") === params.interviewId;
    setIsProPreview(previewFromUrl || previewFromSession);
  }, [params.interviewId, searchParams]);

  const GetFeedBack = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
    const total = result.reduce((sum, item) => sum + Number(item.rating), 0);
    setAvgRating(Math.round(total / result?.length));
  };

  const openUpgradeModal = (dismissible = true) => {
    setPricingDismissible(dismissible);
    setShowPricingModal(true);
  };

  return (
    <div className="space-y-5 py-4">
      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        dismissible={pricingDismissible}
      />

      {feedbackList?.length === 0 ? (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800">No feedback found yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complete the interview questions first, then come back to review your analysis.
          </p>
        </div>
      ) : (
        <>
          {isProPreview && (
            <div className="rounded-2xl border border-[#00BFA6] bg-[#00BFA6]/10 p-4 text-sm font-semibold text-slate-900">
              ⭐ Pro Preview Results - this level of detail is available every time on Pro
            </div>
          )}

          {/* Header card */}
          <div className="glass-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Interview feedback</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {hasFullAccess
                    ? "Review each answer and use the guidance to improve your next mock session."
                    : "Free results include a basic completion summary. Upgrade to unlock detailed analysis, scores, and answer tips."}
                </p>
                {hasFullAccess ? (
                  <div className="mt-4 flex items-center gap-2">
                    <Trophy className={`h-5 w-5 ${avgRating < 6 ? "text-rose-500" : "text-emerald-500"}`} />
                    <span className="text-sm font-medium text-slate-700">Overall rating:</span>
                    <span className={`text-lg font-bold ${avgRating < 6 ? "text-rose-600" : "text-emerald-600"}`}>
                      {avgRating}/10
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal(true)}
                    className="mt-4 rounded-full bg-[#00BFA6] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Upgrade for full analysis
                  </button>
                )}
              </div>

              {/* Share button */}
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 hover:shadow-md"
              >
                <Share2 className="h-4 w-4" />
                Share feedback
              </button>
            </div>
          </div>

          {hasFullAccess && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-card p-5">
                <h3 className="font-semibold text-slate-900">Strength & weakness mapping</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Strong answers are mapped by score, while lower-scored answers highlight the areas to tighten next.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-slate-900">Score breakdown</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Average score: {Number.isFinite(avgRating) ? avgRating * 10 : 0}%. Use each question rating below for the detailed split.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-slate-900">Improvement roadmap</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Re-record your weakest answers, compare against ideal answer tips, then repeat the session with a tighter structure.
                </p>
              </div>
            </div>
          )}

          {/* Per-question collapsibles */}
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="glass-card overflow-hidden">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-6 bg-white p-4 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-800 truncate">{item.question}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasFullAccess && <RatingBadge rating={item.rating} />}
                  <ChevronsUpDownIcon className="h-5 w-5 text-slate-400" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t bg-slate-50 p-4">
                <div className="space-y-2">
                  <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-900">
                    <strong>Your Answer:</strong> {item.userAns}
                  </div>
                  {hasFullAccess ? (
                    <>
                      <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-900">
                        <strong>Suggested Answer:</strong> {item.correctAns}
                      </div>
                      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                        <strong>Detailed Response Analysis:</strong> {item.feedback}
                      </div>
                      <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm text-teal-900">
                        <strong>Ideal Answer Tip:</strong> Lead with the direct answer, support it with one concrete example, then close with measurable impact.
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm text-teal-900">
                      Detailed analysis, scores, strengths, weaknesses, and ideal answer tips are available on Pro.
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {isProPreview && (
            <div className="rounded-2xl border-2 border-[#00BFA6] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">Ready to keep improving?</h3>
              <p className="mt-2 text-sm text-slate-600">
                You've seen what Pro can do. Unlock it permanently.
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                You just experienced Pro. Upgrade to keep getting results like this.
              </p>
              <button
                type="button"
                onClick={() => openUpgradeModal(false)}
                className="mt-5 rounded-full bg-[#00BFA6] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Upgrade to Pro - $9/mo
              </button>
            </div>
          )}
        </>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          ← Back
        </Button>
        <Link href="/dashboard">
          <Button className="rounded-full">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareModal
          interviewId={params.interviewId}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

export default Feedback;
