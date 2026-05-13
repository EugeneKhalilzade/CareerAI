"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_compnents/QuestionsSections";
import RecordAnswerSection from "./_compnents/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { normalizeInterviewQuestions } from "@/utils/interviewQuestions";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetail();
  }, []);

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

  const totalQuestions = mockInterviewQuestion?.length || 0;
  const hasQuestions = totalQuestions > 0;

  return (
    <div className="space-y-6">
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

      {hasQuestions ? (
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
              <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}>
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
