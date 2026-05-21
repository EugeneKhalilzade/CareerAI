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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <Sparkles className="h-12 w-12 text-violet-400" />
        <h1 className="text-2xl font-bold text-slate-900">Feedback not found</h1>
        <p className="max-w-sm text-slate-500">
          This link may be invalid or the interview hasn't been completed yet.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
            Go to CareerAI <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const ratingColor =
    avgRating >= 8
      ? "text-emerald-600"
      : avgRating >= 5
      ? "text-amber-600"
      : "text-rose-600";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 tracking-tight leading-tight">
                Karyer<span className="text-violet-600">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 leading-tight">
                Practice interviews with confidence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700"
            >
              {copied ? (
                <><CheckCheck className="h-4 w-4 text-emerald-500" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy link</>
              )}
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
                  Try CareerAI <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        {/* Hero card */}
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 shadow-xl">
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">
              Mock Interview Results
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              {interview.jobPosition}
            </h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-violet-100">
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
          <div className="flex flex-wrap items-center gap-8 bg-black/20 px-6 py-5 md:px-8">
            <ScoreRing score={avgRating} />
            <div>
              <p className="text-sm font-medium text-violet-200">Overall score</p>
              <p className={`text-5xl font-black ${ratingColor === "text-emerald-600" ? "text-emerald-300" : ratingColor === "text-amber-600" ? "text-amber-300" : "text-rose-300"}`}>
                {avgRating}
                <span className="text-2xl font-bold text-white/50">/10</span>
              </p>
              <p className="mt-1 text-sm text-violet-200">
                across {feedbackList.length} question{feedbackList.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Q&A cards */}
        <div className="space-y-3">
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50/80 transition-colors">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-800 leading-snug">{item.question}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RatingBadge rating={item.rating} />
                  <ChevronsUpDownIcon className="h-4 w-4 text-slate-400" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 border-t bg-slate-50/80 p-4">
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-900">
                    <strong>Candidate Answer:</strong> {item.userAns || <em className="opacity-60">No answer recorded</em>}
                  </div>
                  <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-900">
                    <strong>Suggested Answer:</strong> {item.correctAns}
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                    <strong>AI Feedback:</strong> {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center">
          <Trophy className="mx-auto h-8 w-8 text-violet-500" />
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Ready to practice your own interview?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            CareerAI generates tailored mock interviews and gives you instant AI feedback — for free.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 transition"
          >
            Start practicing now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400">
              Shared via <strong>CareerAI</strong> · No personal data is exposed on this page
        </p>
      </main>
    </div>
  );
}
