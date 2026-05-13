"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Camera, Lightbulb, PlayCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
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
    setInterviewData(result[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Interview setup</h1>
        <p className="mt-1 text-slate-600">
          Review your session details, enable your webcam, and begin when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass-card space-y-4 p-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Job role
            </h2>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {interviewData?.jobPosition}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Job description / stack
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">{interviewData?.jobDesc}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Experience
            </h2>
            <p className="mt-1 text-sm text-slate-700">{interviewData?.jobExperience} years</p>
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-yellow-800">
              <Lightbulb className="h-5 w-5" />
              Before you start
            </h3>
            <p className="mt-2 text-sm text-yellow-800">{process.env.NEXT_PUBLIC_INFORMATION}</p>
          </div>
        </div>

        <div className="glass-card flex flex-col items-center justify-center p-6">
          {webCamEnabled ? (
            <Webcam
              mirrored
              style={{ height: 300, width: 320, borderRadius: 16 }}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
            />
          ) : (
            <>
              <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                <Camera className="h-16 w-16 text-slate-400" />
              </div>
              <Button
                variant="secondary"
                className="mt-4 rounded-full"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Webcam & Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button className="rounded-full px-8">
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
