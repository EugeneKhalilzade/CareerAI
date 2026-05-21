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
import {
  extractResumeText,
  normalizeResumeText,
  RESUME_SUPPORTED_EXTENSIONS,
} from "@/utils/resumeUtils";
import { FileText, LoaderCircle, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";

const MAX_RESUME_CHARS = 12000;
const MAX_JOB_CHARS = 4000;

function ResumeTailor() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    try {
      const text = await extractResumeText(file, { maxChars: MAX_RESUME_CHARS });
      setResumeText(text);
      toast.success("Resume loaded. You can edit it below.");
    } catch (error) {
      toast.error(error?.message || "Could not read that resume file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    const normalizedResume = normalizeResumeText(resumeText, MAX_RESUME_CHARS);
    if (!normalizedResume) {
      toast.error("Please add your resume text first.");
      return;
    }

    setLoading(true);
    try {
      const normalizedJob = normalizeResumeText(jobDescription, MAX_JOB_CHARS);
      const prompt = `You are a professional resume writer. Tailor the resume to match the target job.
Rules:
- Keep the resume ATS-friendly and concise.
- Use strong action verbs and quantify impact where possible.
- Keep or create clear sections (Summary, Experience, Projects, Skills, Education).
- If a job description is provided, align keywords and emphasize matching skills.
Return ONLY the tailored resume in Markdown. No commentary, no code fences.

Resume:
${normalizedResume}

Target job description:
${normalizedJob || "Not provided."}`;

      const result = await chatSession.sendMessage(prompt);
      const raw = result.response.text();
      const cleaned = raw
        .replace(/^```[a-z]*\n?/i, "")
        .replace(/```$/i, "")
        .trim();
      setTailoredResume(cleaned);
    } catch (error) {
      toast.error("Could not generate a tailored resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!tailoredResume) return;
    try {
      await navigator.clipboard.writeText(tailoredResume);
      toast.success("Tailored resume copied to clipboard.");
    } catch (error) {
      toast.error("Copy failed. Please select and copy manually.");
    }
  };

  return (
    <div>
      <div
        className="glass-card flex min-h-56 cursor-pointer flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-xl"
        onClick={() => setOpenDialog(true)}
      >
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Tailor your resume</h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload or paste your resume and get a professional, job-aligned version.
          </p>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">AI resume tailor</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">
                        Upload resume (PDF or text)
                      </label>
                      <Input
                        type="file"
                        accept={RESUME_SUPPORTED_EXTENSIONS}
                        onChange={handleResumeUpload}
                      />
                      {resumeFileName ? (
                        <p className="text-xs text-slate-500">Loaded: {resumeFileName}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">
                        Resume text
                      </label>
                      <Textarea
                        value={resumeText}
                        onChange={(event) => setResumeText(event.target.value)}
                        placeholder="Paste your resume content here."
                        rows={10}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">
                        Target job description (optional)
                      </label>
                      <Textarea
                        value={jobDescription}
                        onChange={(event) => setJobDescription(event.target.value)}
                        placeholder="Paste a job description to tailor for."
                        rows={6}
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                      Keep the text short and focused. The AI will rewrite your resume to
                      match the role and highlight the most relevant skills.
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Close
                  </Button>
                  <div className="flex gap-2">
                    {tailoredResume ? (
                      <Button type="button" variant="secondary" onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy result
                      </Button>
                    ) : null}
                    <Button disabled={loading} type="submit" className="rounded-full">
                      {loading ? (
                        <>
                          <LoaderCircle className="mr-2 animate-spin" /> Tailoring...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Tailor with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Tailored resume
                  </label>
                  <Textarea
                    value={tailoredResume}
                    readOnly
                    placeholder="Your tailored resume will appear here."
                    rows={12}
                  />
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResumeTailor;
