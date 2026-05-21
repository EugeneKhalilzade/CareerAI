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
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION} interview questions and answers in JSON format based on the following: Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Only return JSON without additional text.`;
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
        <PlusCircle className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Start a new mock interview</h2>
          <p className="mt-1 text-sm text-slate-600">
            Create a role-focused session in seconds and begin practicing immediately.
          </p>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Build your interview session
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <h2 className="text-sm text-slate-600">
                    Add your target role details so CareerAI can generate relevant
                    questions and expected answers.
                  </h2>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Job Role / Position</label>
                    <Input
                      value={jobPosition}
                      onChange={(event) => setJobPosition(event.target.value)}
                      placeholder="Ex. Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">
                      Job Description / Tech Stack
                    </label>
                    <Textarea
                      value={jobDesc}
                      onChange={(event) => setJobDesc(event.target.value)}
                      placeholder="Ex. React, Next.js, Node.js, API design, system design basics"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Years of experience</label>
                    <Input
                      value={jobExperience}
                      onChange={(event) => setJobExperience(event.target.value)}
                      placeholder="Ex. 5"
                      type="number"
                      min="0"
                      max="50"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit" className="rounded-full">
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
