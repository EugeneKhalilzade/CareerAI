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
import { FileText, LoaderCircle, Wand2, Copy, Download, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

const MAX_RESUME_CHARS = 12000;
const MAX_JOB_CHARS = 4000;

function ResumeTailor() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const exportToTxt = () => {
    if (!tailoredResume) return;
    try {
      const element = document.createElement("a");
      const file = new Blob([tailoredResume], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `tailored-resume-${new Date().getTime()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Resume exported as TXT.");
      setShowExportMenu(false);
    } catch (error) {
      toast.error("TXT export failed. Please try again.");
    }
  };

  const exportToPdf = () => {
    if (!tailoredResume) return;
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const textWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      const lineHeight = 5;
      const fontSize = 10;

      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(tailoredResume, textWidth);

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      doc.save(`tailored-resume-${new Date().getTime()}.pdf`);
      toast.success("Resume exported as PDF.");
      setShowExportMenu(false);
    } catch (error) {
      toast.error("PDF export failed. Please try again.");
    }
  };

  const exportToDocx = async () => {
    if (!tailoredResume) return;
    try {
      const doc = new Document({
        sections: [
          {
            children: tailoredResume.split("\n").map(
              (line) =>
                new Paragraph({
                  text: line || " ",
                  run: new TextRun({
                    font: "Calibri",
                    size: 11 * 2,
                  }),
                })
            ),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `tailored-resume-${new Date().getTime()}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Resume exported as DOCX.");
      setShowExportMenu(false);
    } catch (error) {
      toast.error("DOCX export failed. Please try again.");
    }
  };

  return (
    <div>
      <div
        className="glass-card flex min-h-56 cursor-pointer flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-xl"
        onClick={() => setOpenDialog(true)}
      >
        <FileText className="h-8 w-8 text-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-white">Tailor your resume</h2>
          <p className="mt-1 text-sm text-slate-400">
            Upload or paste your resume and get a professional, job-aligned version.
          </p>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl border border-cyan-500/20 bg-[#050510]/95 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">AI resume tailor</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        Upload resume (PDF or text)
                      </label>
                      <Input
                        type="file"
                        accept={RESUME_SUPPORTED_EXTENSIONS}
                        onChange={handleResumeUpload}
                        className="cursor-pointer border-cyan-500/40 bg-[#050510] text-white file:bg-cyan-500/10 file:text-cyan-400 file:font-semibold file:border-0 file:px-4 file:py-2 hover:border-cyan-500/60 focus-visible:ring-cyan-500/30"
                      />
                      {resumeFileName ? (
                        <p className="text-xs text-cyan-400 font-bold">Loaded: {resumeFileName}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        Resume text
                      </label>
                      <Textarea
                        value={resumeText}
                        onChange={(event) => setResumeText(event.target.value)}
                        placeholder="Paste your resume content here."
                        rows={10}
                        className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        Target job description (optional)
                      </label>
                      <Textarea
                        value={jobDescription}
                        onChange={(event) => setJobDescription(event.target.value)}
                        placeholder="Paste a job description to tailor for."
                        rows={6}
                        className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
                      />
                    </div>

                    <div className="rounded-xl border border-cyan-500/20 bg-[#050510] p-4 text-xs text-slate-400">
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
                    className="text-slate-400 hover:text-white"
                  >
                    Close
                  </Button>
                  <div className="flex gap-2">
                    {tailoredResume ? (
                      <>
                        <Button type="button" variant="outline" className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400" onClick={handleCopy}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy result
                        </Button>
                        <div className="relative">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                          {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-32 rounded-md border border-cyan-500/30 bg-[#050510] shadow-lg z-50">
                              <button
                                type="button"
                                onClick={exportToTxt}
                                className="block w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                              >
                                Export as TXT
                              </button>
                              <button
                                type="button"
                                onClick={exportToPdf}
                                className="block w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                              >
                                Export as PDF
                              </button>
                              <button
                                type="button"
                                onClick={exportToDocx}
                                className="block w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                              >
                                Export as DOCX
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : null}
                    <Button disabled={loading} type="submit" className="rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] border-0">
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Tailored resume
                  </label>
                  <Textarea
                    value={tailoredResume}
                    readOnly
                    placeholder="Your tailored resume will appear here."
                    rows={12}
                    className="rounded-xl border-cyan-500/20 bg-[#050510] text-white focus-visible:ring-cyan-500/30"
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
