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
      <div className="glass-card p-6 text-sm text-[#b6a66d]">
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
                  ? "border-[#d4af37] bg-[#d4af37] text-[#06180d]"
                  : "border-[#d4af37]/20 bg-[#0b1c12] text-[#b6a66d] hover:border-[#d4af37]/60 hover:text-[#f3d76b]"
              }`}
            >
              Q{index + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold leading-7 text-white md:text-lg">
            {questions[activeQuestionIndex]?.question}
          </h2>
          <button
            onClick={() => textToSpeach(questions[activeQuestionIndex]?.question)}
            className="rounded-full border border-[#d4af37]/20 bg-[#0b1c12] p-2 text-[#d4af37] transition hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10"
            aria-label="Read question aloud"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-[#d4af37]/20 bg-[#0b1c12] p-4">
          <h2 className="flex items-center gap-2 font-semibold text-[#f5f0e8]">
            <Lightbulb className="h-5 w-5 text-[#d4af37]" />
            Note
          </h2>
          <h2 className="mt-2 text-sm leading-6 text-[#b6a66d]">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSections;
