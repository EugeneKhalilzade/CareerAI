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
  if (error) {
    toast(error);
    return;
  }

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
    const feedbackPromt = `Question: ${activeQuestion.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. The feedback should in JSON format only nothing else field should be rating and feeback only, in just 3 to 5 lines.`;
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
      createdAt: moment().format("DD-MM-yyyy"),
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
      <h2 className="text-lg font-semibold text-slate-900">Record your answer</h2>
      <p className="mt-1 text-sm text-slate-600">
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

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Live transcript
        </p>
        <p className="mt-2 min-h-12 text-sm text-slate-700">
          {userAnswer || "Your spoken answer will appear here in real time."}
        </p>
      </div>

      <Button
        disabled={loading || !questions.length}
        variant={isRecording ? "destructive" : "outline"}
        onClick={StartStopRecording}
        className="mt-5"
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
