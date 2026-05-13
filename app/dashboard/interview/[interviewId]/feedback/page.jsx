"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
  

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState();
  const router = useRouter();

  useEffect(() => {
    GetFeedBack();
  }, []);

  const GetFeedBack = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
    const getTotalOfRating = result.reduce((sum, item) => sum + Number(item.rating), 0);
    setAvgRating(Math.round(getTotalOfRating / result?.length));
  };

  return (
    <div className="space-y-5 py-4">
      {feedbackList?.length == 0 ? (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800">No feedback found yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complete the interview questions first, then come back to review your analysis.
          </p>
        </div>
      ) : (
        <>
          <div className="glass-card p-6">
            <h2 className="text-3xl font-bold text-slate-900">Interview feedback</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review each answer and use the guidance to improve your next mock session.
            </p>
            <h2 className="mt-4 text-lg text-primary">
              Overall rating:{" "}
              <strong className={avgRating < 6 ? "text-red-600" : "text-green-600"}>
                {avgRating}/10
              </strong>
            </h2>
          </div>

          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="glass-card overflow-hidden">
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-6 bg-white p-4 text-left">
                  <span className="font-medium text-slate-800">{item.question}</span>
                  <ChevronsUpDownIcon className="h-5 w-5 text-slate-500" />
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t bg-slate-50 p-4">
                  <div className="space-y-2">
                    <h2 className="rounded-lg bg-white p-3 text-sm text-slate-700">
                      <strong>Rating:</strong> {item.rating}
                    </h2>
                    <h2 className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-900">
                      <strong>Your Answer:</strong> {item.userAns}
                    </h2>
                    <h2 className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-900">
                      <strong>Suggested Answer:</strong> {item.correctAns}
                    </h2>
                    <h2 className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                      <strong>Improvement Feedback:</strong> {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}

      <Button onClick={() => router.replace("/dashboard")} className="rounded-full">
        Back to Dashboard
      </Button>
    </div>
  );
}

export default Feedback;
