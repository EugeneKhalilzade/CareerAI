"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Star,
  Trophy,
  BriefcaseBusiness,
  CalendarClock,
  Copy,
  CheckCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDownIcon } from "lucide-react";
import Link from "next/link";
import DarkShell from "@/components/DarkShell";

// ── Helpers ───────────────────────────────────────────────────────────────────
function RatingBadge({ rating }) {
  const n = Number(rating);
  const color =
    n >= 8
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : n >= 5
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${color}`}
    >
      <Star className="h-3 w-3 fill-current" />
      {rating}/10
    </span>
  );
}

function ScoreRing({ score }) {
  const pct = Math.min(score / 10, 1);
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color =
    score >= 8 ? "#10b981" : score >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-black text-white">{score}</p>
        <p className="text-xs text-white/60 font-medium">/ 10</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SharePage({ params }) {
  const { interviewId } = params;
  const [interview, setInterview] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [interviewRows, answerRows] = await Promise.all([
        db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId)),
        db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, interviewId))
          .orderBy(UserAnswer.id),
      ]);

      if (interviewRows.length === 0 || answerRows.length === 0) {
        setNotFound(true);
        return;
      }

      setInterview(interviewRows[0]);
      setFeedbackList(answerRows);
      const total = answerRows.reduce((s, a) => s + Number(a.rating), 0);
      setAvgRating(Math.round(total / answerRows.length));
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DarkShell className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37]/30 border-t-[#d4af37]" />
      </DarkShell>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <DarkShell className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <Sparkles className="h-12 w-12 text-[#d4af37]" />
        <h1 className="text-2xl font-bold text-white">Feedback not found</h1>
        <p className="max-w-sm text-[#b6a66d]">
          This link may be invalid or the interview hasn&apos;t been completed yet.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#d4af37] px-5 py-2 text-sm font-semibold text-[#06180d] hover:bg-[#f3d76b]"
        >
          Go to CareerAI <ArrowRight className="h-4 w-4" />
        </Link>
      </DarkShell>
    );
  }

  const ratingColor =
    avgRating >= 8
      ? "text-emerald-300"
      : avgRating >= 5
      ? "text-amber-300"
      : "text-rose-300";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DarkShell className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#d4af37]/15 bg-[#071109]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d4af37]/15">
              <Sparkles className="h-4 w-4 text-[#d4af37]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#f5f0e8] tracking-tight leading-tight">
                Career<span className="text-[#d4af37]">AI</span>
              </span>
              <span className="text-[10px] font-medium text-[#a08c4a] leading-tight">
                Practice interviews with confidence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#0b1c12] px-4 py-1.5 text-sm font-medium text-[#b6a66d] shadow-sm transition hover:border-[#d4af37]/60 hover:text-[#f3d76b]"
            >
              {copied ? (
                <><CheckCheck className="h-4 w-4 text-emerald-300" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy link</>
              )}
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full bg-[#d4af37] px-4 py-1.5 text-sm font-semibold text-[#06180d] transition hover:bg-[#f3d76b]"
            >
              Try CareerAI <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        {/* Hero card */}
        <div className="overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#12351f] via-[#0d2a18] to-[#071109] shadow-xl">
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#a08c4a]">
              Mock Interview Results
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              {interview.jobPosition}
            </h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#b6a66d]">
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness className="h-4 w-4" />
                {interview.jobExperience} yrs experience
              </span>
              {interview.createdAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4" />
                  {interview.createdAt}
                </span>
              )}
            </div>
          </div>

          {/* Score strip */}
          <div className="flex flex-wrap items-center gap-8 bg-black/25 px-6 py-5 md:px-8">
            <ScoreRing score={avgRating} />
            <div>
              <p className="text-sm font-medium text-[#b6a66d]">Overall score</p>
              <p className={`text-5xl font-black ${ratingColor}`}>
                {avgRating}
                <span className="text-2xl font-bold text-white/50">/10</span>
              </p>
              <p className="mt-1 text-sm text-[#b6a66d]">
                across {feedbackList.length} question{feedbackList.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Q&A cards */}
        <div className="space-y-3">
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="overflow-hidden rounded-2xl border border-[#d4af37]/15 bg-[#0d2a18]/80 shadow-lg shadow-black/30 backdrop-blur">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-[#0b1c12] transition-colors">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/15 text-xs font-bold text-[#d4af37]">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-white leading-snug">{item.question}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RatingBadge rating={item.rating} />
                  <ChevronsUpDownIcon className="h-4 w-4 text-[#a08c4a]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 border-t border-[#d4af37]/15 bg-[#08160d] p-4">
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                    <strong>Candidate Answer:</strong> {item.userAns || <em className="opacity-60">No answer recorded</em>}
                  </div>
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    <strong>Suggested Answer:</strong> {item.correctAns}
                  </div>
                  <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-3 text-sm text-sky-200">
                    <strong>AI Feedback:</strong> {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl border border-[#d4af37]/20 bg-[#0b1c12] p-6 text-center">
          <Trophy className="mx-auto h-8 w-8 text-[#d4af37]" />
          <h2 className="mt-3 text-xl font-bold text-white">
            Ready to practice your own interview?
          </h2>
          <p className="mt-1 text-sm text-[#b6a66d]">
            CareerAI generates tailored mock interviews and gives you instant AI feedback — for free.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-2.5 text-sm font-semibold text-[#06180d] shadow hover:bg-[#f3d76b] transition"
          >
            Start practicing now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-center text-xs text-[#a08c4a]">
          Shared via <strong>CareerAI</strong> · No personal data is exposed on this page
        </p>
      </main>
    </DarkShell>
  );
}
