"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { normalizeInterviewQuestions } from "@/utils/interviewQuestions";
import { extractResumeText, normalizeResumeText, RESUME_SUPPORTED_EXTENSIONS } from "@/utils/resumeUtils";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    try {
      const text = await extractResumeText(file, { maxChars: 6000 });
      setResumeText(text);
      toast.success("Resume loaded. You can edit it below.");
    } catch (error) {
      toast.error(error?.message || "Could not read that resume file.");
    } finally {
      event.target.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const normalizedResume = normalizeResumeText(resumeText, 6000);
    const resumeContext = normalizedResume
      ? `Candidate resume:\n${normalizedResume}\n\n`
      : "";
    const inputPrompt = `${resumeContext}Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION} interview questions and answers in JSON format based on the following: Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Only return JSON without additional text.`;
    const result = await chatSession.sendMessage(inputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    const normalizedQuestions = normalizeInterviewQuestions(MockJsonResp);

    if (normalizedQuestions.length === 0) {
      toast.error("Could not generate valid interview questions. Please try again.");
      setLoading(false);
      return;
    }

    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
        mockId: uuidv4(),
        jsonMockResp: JSON.stringify(normalizedQuestions),
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      })
        .returning({ mockId: MockInterview.mockId });

      if (resp) {
        route.push("/dashboard/interview/" + resp[0].mockId);
        setOpenDialog(false);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="glass-card flex min-h-56 cursor-pointer flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-xl"
        onClick={() => setOpenDialog(true)}
      >
        <PlusCircle className="h-8 w-8 text-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-white">Start a new mock interview</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create a role-focused session in seconds and begin practicing immediately.
          </p>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl border border-cyan-500/20 bg-[#050510]/95 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              Build your interview session
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <h2 className="text-sm text-slate-400">
                    Add your target role details so CareerAI can generate relevant
                    questions and expected answers.
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Job Role / Position</label>
                    <Input
                      value={jobPosition}
                      onChange={(event) => setJobPosition(event.target.value)}
                      placeholder="Ex. Full Stack Developer"
                      required
                      className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Job Description / Tech Stack
                    </label>
                    <Textarea
                      value={jobDesc}
                      onChange={(event) => setJobDesc(event.target.value)}
                      placeholder="Ex. React, Next.js, Node.js, API design, system design basics"
                      required
                      className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Years of experience</label>
                    <Input
                      value={jobExperience}
                      onChange={(event) => setJobExperience(event.target.value)}
                      placeholder="Ex. 5"
                      type="number"
                      min="0"
                      max="50"
                      required
                      className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Resume (optional)
                    </label>
                    <Input
                      type="file"
                      accept={RESUME_SUPPORTED_EXTENSIONS}
                      onChange={handleResumeUpload}
                      className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30 file:text-cyan-400 file:bg-cyan-500/10 file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3 file:cursor-pointer"
                    />
                    {resumeFileName ? (
                      <p className="text-xs text-cyan-400 font-bold">Loaded: {resumeFileName}</p>
                    ) : null}
                    <Textarea
                      value={resumeText}
                      onChange={(event) => setResumeText(event.target.value)}
                      placeholder="Paste your resume text here to personalize questions."
                      rows={6}
                      className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] border-0"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="mr-2 animate-spin" /> Generating...
                      </>
                    ) : (
                      "Generate Interview with AI"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
