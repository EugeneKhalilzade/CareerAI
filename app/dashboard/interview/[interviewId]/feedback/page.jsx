"use client"; // Neon theme applied

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
    n >= 8 ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
    : n >= 5 ? "bg-amber-500/15 text-amber-200 border-amber-400/30"
    : "bg-rose-500/15 text-rose-200 border-rose-400/30";
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
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#22d3ee]/20 bg-[#071109] p-6 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22d3ee]/10">
            <Share2 className="h-5 w-5 text-[#22d3ee]" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Share feedback</h2>
            <p className="text-xs text-[#22d3ee]">Anyone with this link can view your results</p>
          </div>
        </div>

        {/* URL row */}
        <div className="flex items-center gap-2 rounded-xl border border-[#22d3ee]/20 bg-[#0b1c12] p-3">
          <span className="flex-1 truncate text-sm text-[#22d3ee]">{shareUrl}</span>
          <button
            onClick={copy}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#22d3ee] px-3 py-1.5 text-xs font-semibold text-[#06180d] transition hover:bg-[#a855f7]"
          >
            {copied ? (
              <><CheckCheck className="h-3.5 w-3.5" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy link</>
            )}
          </button>
        </div>

        {/* Preview chip */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#22d3ee]/20 bg-[#0b1c12] p-3">
          <ArrowUpRight className="h-4 w-4 text-[#22d3ee] shrink-0" />
          <p className="text-xs text-[#22d3ee]">
            The shared page is public and shows your questions, answers, and AI feedback — but <strong>never</strong> your email or personal info.
          </p>
        </div>

        {/* Open in new tab */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee]/10"
            onClick={onClose}
          >
            Close
          </Button>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full rounded-xl bg-[#22d3ee] text-[#06180d] hover:bg-[#a855f7]">
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
          <h2 className="text-xl font-bold text-white">No feedback found yet</h2>
          <p className="mt-2 text-sm text-[#22d3ee]">
            Complete the interview questions first, then come back to review your analysis.
          </p>
        </div>
      ) : (
        <>
          {isProPreview && (
            <div className="rounded-2xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 p-4 text-sm font-semibold text-white">
              ⭐ Pro Preview Results - this level of detail is available every time on Pro
            </div>
          )}

          {/* Header card */}
          <div className="glass-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">Interview feedback</h2>
                <p className="mt-2 text-sm text-[#22d3ee]">
                  {hasFullAccess
                    ? "Review each answer and use the guidance to improve your next mock session."
                    : "Free results include a basic completion summary. Upgrade to unlock detailed analysis, scores, and answer tips."}
                </p>
                {hasFullAccess ? (
                  <div className="mt-4 flex items-center gap-2">
                    <Trophy className={`h-5 w-5 ${avgRating < 6 ? "text-rose-300" : "text-emerald-300"}`} />
                    <span className="text-sm font-medium text-[#f5f0e8]">Overall rating:</span>
                    <span className={`text-lg font-bold ${avgRating < 6 ? "text-rose-300" : "text-emerald-300"}`}>
                      {avgRating}/10
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal(true)}
                    className="mt-4 rounded-full bg-[#22d3ee] px-5 py-2 text-sm font-semibold text-[#06180d] transition hover:bg-[#a855f7]"
                  >
                    Upgrade for full analysis
                  </button>
                )}
              </div>

              {/* Share button */}
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-2.5 text-sm font-semibold text-[#22d3ee] transition hover:bg-[#22d3ee]/20 hover:shadow-md"
              >
                <Share2 className="h-4 w-4" />
                Share feedback
              </button>
            </div>
          </div>

          {hasFullAccess && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white">Strength & weakness mapping</h3>
                <p className="mt-2 text-sm leading-6 text-[#22d3ee]">
                  Strong answers are mapped by score, while lower-scored answers highlight the areas to tighten next.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white">Score breakdown</h3>
                <p className="mt-2 text-sm leading-6 text-[#22d3ee]">
                  Average score: {Number.isFinite(avgRating) ? avgRating * 10 : 0}%. Use each question rating below for the detailed split.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white">Improvement roadmap</h3>
                <p className="mt-2 text-sm leading-6 text-[#22d3ee]">
                  Re-record your weakest answers, compare against ideal answer tips, then repeat the session with a tighter structure.
                </p>
              </div>
            </div>
          )}

          {/* Per-question collapsibles */}
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="glass-card overflow-hidden">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-6 bg-[#0b1c12] p-4 text-left hover:bg-[#0d2a18] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#22d3ee]/15 text-xs font-bold text-[#22d3ee]">
                    {index + 1}
                  </span>
                  <span className="font-medium text-white truncate">{item.question}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasFullAccess && <RatingBadge rating={item.rating} />}
                  <ChevronsUpDownIcon className="h-5 w-5 text-[#c084fc]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-[#22d3ee]/15 bg-[#08160d] p-4">
                <div className="space-y-2">
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                    <strong>Your Answer:</strong> {item.userAns}
                  </div>
                  {hasFullAccess ? (
                    <>
                      <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                        <strong>Suggested Answer:</strong> {item.correctAns}
                      </div>
                      <div className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-3 text-sm text-sky-200">
                        <strong>Detailed Response Analysis:</strong> {item.feedback}
                      </div>
                      <div className="rounded-lg border border-teal-400/30 bg-teal-500/10 p-3 text-sm text-teal-200">
                        <strong>Ideal Answer Tip:</strong> Lead with the direct answer, support it with one concrete example, then close with measurable impact.
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-teal-400/30 bg-teal-500/10 p-3 text-sm text-teal-200">
                      Detailed analysis, scores, strengths, weaknesses, and ideal answer tips are available on Pro.
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {isProPreview && (
            <div className="rounded-2xl border-2 border-[#22d3ee]/40 bg-[#0b1c12] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white">Ready to keep improving?</h3>
              <p className="mt-2 text-sm text-[#22d3ee]">
                You&apos;ve seen what Pro can do. Unlock it permanently.
              </p>
              <p className="mt-3 text-sm font-semibold text-white">
                You just experienced Pro. Upgrade to keep getting results like this.
              </p>
              <button
                type="button"
                onClick={() => openUpgradeModal(false)}
                className="mt-5 rounded-full bg-[#22d3ee] px-5 py-3 text-sm font-semibold text-[#06180d] transition hover:bg-[#a855f7]"
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
          className="rounded-full border-[#22d3ee]/40 text-[#22d3ee] hover:bg-[#22d3ee]/10"
          onClick={() => window.history.back()}
        >
          ← Back
        </Button>
        <Link href="/dashboard">
          <Button className="rounded-full bg-[#22d3ee] text-[#06180d] hover:bg-[#a855f7]">Back to Dashboard</Button>
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
