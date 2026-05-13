"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSections({
  activeQuestionIndex,
  mockInterViewQuestion,
  setActiveQuestionIndex,
}) {
  const questions = Array.isArray(mockInterViewQuestion) ? mockInterViewQuestion : [];

  const textToSpeach = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech. Try Chrome.");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="glass-card p-6 text-sm text-slate-700">
        No interview questions available for this session.
      </div>
    );
  }

  return (
    questions && (
      <div className="glass-card p-6">
        <div className="grid grid-cols-3 gap-2 text-center md:grid-cols-4 lg:grid-cols-5">
          {questions.map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setActiveQuestionIndex(index)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition md:text-sm ${
                activeQuestionIndex == index
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/40"
              }`}
            >
              Q{index + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold leading-7 text-slate-900 md:text-lg">
            {questions[activeQuestionIndex]?.question}
          </h2>
          <button
            onClick={() => textToSpeach(questions[activeQuestionIndex]?.question)}
            className="rounded-full border border-slate-200 bg-white p-2 transition hover:border-primary/40 hover:text-primary"
            aria-label="Read question aloud"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h2 className="flex items-center gap-2 font-semibold text-blue-800">
            <Lightbulb className="h-5 w-5" />
            Note
          </h2>
          <h2 className="mt-2 text-sm leading-6 text-blue-800">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSections;
