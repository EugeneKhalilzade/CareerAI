"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({
  activeQuestionIndex,
  mockInterViewQuestion,
  interviewData,
  plan = "free",
  isProPreview = false,
}) {
  const questions = Array.isArray(mockInterViewQuestion) ? mockInterViewQuestion : [];
  const activeQuestion = questions[activeQuestionIndex];
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    const latestTranscript = results?.[results.length - 1]?.transcript;
    if (latestTranscript) {
      setUserAnswer((prevAns) => `${prevAns} ${latestTranscript}`.trim());
    }
  }, [results]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  useEffect(() => {
    if (isRecording || loading) return;

    if (userAnswer.trim().length > 10) {
      UpdateUserAnswerInDb();
      return;
    }

    if (userAnswer.trim().length > 0) {
      toast("Answer is too short. Please record a little longer.");
      setUserAnswer("");
      setResults([]);
    }
  }, [isRecording, userAnswer, loading, setResults]);

  const UpdateUserAnswerInDb = async () => {
    if (!activeQuestion) {
      toast("No valid question available to evaluate.");
      return;
    }

    setLoading(true);
    const feedbackPromt =
      plan === "free" && !isProPreview
        ? `Question: ${activeQuestion.question}, User Answer: ${userAnswer}. The user is on the free plan, so do not generate detailed analysis. Return JSON only with fields rating and feedback. Set rating to "0" and make feedback a short general summary without score breakdown, strengths, weaknesses, ideal answer tips, or detailed analysis.`
        : `Question: ${activeQuestion.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 and detailed feedback with strengths, weaknesses, improvement tips, and ideal answer guidance. The feedback should be in JSON format only nothing else field should be rating and feedback only.`;
    const result = await chatSession.sendMessage(feedbackPromt);
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: activeQuestion.question,
      correctAns: activeQuestion.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (resp) {
      toast("Your answer was saved.");
      setUserAnswer("");
      setResults([]);
    }
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="glass-card flex flex-col p-6">
      <h2 className="text-lg font-semibold text-white">Record your answer</h2>
      <p className="mt-1 text-sm text-[#b6a66d]">
        Press start, answer clearly, and stop recording when done.
      </p>

      <div className="relative mt-4 flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 p-4">
        <Image src={"/webcam.png"} width={180} height={180} className="absolute opacity-40" />
        <Webcam
          mirrored
          style={{
            height: "40vh",
            width: "100%",
            zIndex: 10,
            borderRadius: 12,
          }}
        />
      </div>

      <div className="mt-4 rounded-xl border border-[#d4af37]/20 bg-[#0b1c12] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#a08c4a]">
          Live transcript
        </p>
        <p className="mt-2 min-h-12 text-sm text-[#f5f0e8]">
          {userAnswer || "Your spoken answer will appear here in real time."}
        </p>
      </div>

      <Button
        disabled={loading || !questions.length}
        variant={isRecording ? "destructive" : "outline"}
        onClick={StartStopRecording}
        className={isRecording ? "mt-5" : "mt-5 border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10"}
      >
        {isRecording ? (
          <h2 className="flex items-center justify-center gap-2">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="flex items-center justify-center gap-2">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
