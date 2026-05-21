"use client";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_compnents/QuestionsSections";
import RecordAnswerSection from "./_compnents/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { normalizeInterviewQuestions } from "@/utils/interviewQuestions";
import PricingModal from "@/components/PricingModal";
import InterviewWarningBanner from "@/components/InterviewWarningBanner";
import { FREE_MAX_DURATION_SECONDS, getInterviewStatus } from "@/lib/interviewLimits";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [plan, setPlan] = useState("free");
  const [interviewCount, setInterviewCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(1);
  const [interviewStatus, setInterviewStatus] = useState("ok");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isProPreview, setIsProPreview] = useState(false);
  const [limitReady, setLimitReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FREE_MAX_DURATION_SECONDS);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    GetInterviewDetail();
  }, []);

  useEffect(() => {
    if (user && interviewData) {
      GetInterviewAccess();
    }
  }, [user, interviewData]);

  useEffect(() => {
    if (!limitReady || plan !== "free" || isProPreview || interviewStatus === "blocked") return;

    setSecondsLeft(FREE_MAX_DURATION_SECONDS);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/interview/" + params.interviewId + "/feedback");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [limitReady, plan, isProPreview, interviewStatus, params.interviewId, router]);

  /**
   * Used to Get Interview Details by MockId/Interview Id
   */

  const GetInterviewDetail = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const currentInterview = result[0];
    const normalizedQuestions = normalizeInterviewQuestions(currentInterview?.jsonMockResp);
    setMockInterviewQuestion(normalizedQuestions);
    setActiveQuestionIndex(0);
    setInterviewData(currentInterview);
  };

  const GetInterviewAccess = async () => {
    const planValue = user?.publicMetadata?.plan || "free";
    const answerRows = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));
    const completedInterviewIds = [...new Set(answerRows.map((item) => item.mockIdRef))];
    const completedBeforeThisInterview = completedInterviewIds.filter(
      (mockId) => mockId !== params.interviewId
    ).length;
    const currentAttemptCount = completedBeforeThisInterview + 1;
    const status = getInterviewStatus(currentAttemptCount, planValue);
    const previewActive = planValue === "free" && completedBeforeThisInterview === 4;

    setPlan(planValue);
    setInterviewCount(completedBeforeThisInterview);
    setAttemptCount(currentAttemptCount);
    setInterviewStatus(status);
    setIsProPreview(previewActive);
    setShowPricingModal(
      planValue === "free" && (currentAttemptCount >= 6 || (currentAttemptCount >= 3 && currentAttemptCount <= 5))
    );
    setLimitReady(true);

    if (previewActive) {
      sessionStorage.setItem("karyerai-pro-preview", params.interviewId);
    }
  };

  const totalQuestions = mockInterviewQuestion?.length || 0;
  const hasQuestions = totalQuestions > 0;
  const timerMinutes = Math.floor(secondsLeft / 60);
  const timerSeconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        dismissible={attemptCount >= 3 && attemptCount <= 5}
      />

      <div className="glass-card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live interview session</h1>
          <p className="text-sm text-slate-600">
            Stay concise, speak clearly, and move through each question.
          </p>
        </div>
        <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          Question {totalQuestions ? activeQuestionIndex + 1 : 0} / {totalQuestions}
        </div>
      </div>

      {isProPreview && (
        <div className="rounded-2xl border border-[#00BFA6]/30 bg-[#00BFA6]/10 p-4 text-sm font-semibold text-slate-900">
          🎁 This is your Pro Preview interview &mdash; you&apos;ll get full detailed analysis this one time!
        </div>
      )}

      {interviewStatus === "warning" && (
        <InterviewWarningBanner
          plan={plan}
          interviewCount={interviewCount}
          isProPreview={isProPreview}
          onUpgrade={() => setShowPricingModal(true)}
        />
      )}

      {plan === "free" && !isProPreview && interviewStatus !== "blocked" && (
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          Free plan timer: {timerMinutes}:{timerSeconds}
        </div>
      )}

      {!limitReady ? (
        <div className="glass-card p-6 text-sm text-slate-700">
          Checking your interview access...
        </div>
      ) : interviewStatus === "blocked" ? (
        <div className="glass-card p-6 text-sm text-slate-700">
          You have reached the free interview limit. Upgrade to Pro to continue practicing.
        </div>
      ) : hasQuestions ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Questions */}
            <QuestionsSections
              activeQuestionIndex={activeQuestionIndex}
              mockInterViewQuestion={mockInterviewQuestion}
              setActiveQuestionIndex={setActiveQuestionIndex}
            />
            {/* Video/ Audio Recording */}
            <RecordAnswerSection
              activeQuestionIndex={activeQuestionIndex}
              mockInterViewQuestion={mockInterviewQuestion}
              interviewData={interviewData}
              plan={plan}
              isProPreview={isProPreview}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {activeQuestionIndex > 0 && (
              <Button variant="outline" onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                Previous Question
              </Button>
            )}

            {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
              <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                Next Question
              </Button>
            )}

            {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
              <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback" + (isProPreview ? "?proPreview=true" : "")}>
                <Button>Finish & View Feedback</Button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="glass-card p-6 text-sm text-slate-700">
          We couldn&apos;t find valid questions for this interview. Create a new interview and try again.
        </div>
      )}
    </div>
  );
}

export default StartInterview;
