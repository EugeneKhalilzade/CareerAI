"use client"; // Neon theme applied
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
        <h1 className="text-3xl font-bold text-white">Interview setup</h1>
        <p className="mt-1 text-[#22d3ee]">
          Review your session details, enable your webcam, and begin when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass-card space-y-4 p-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c084fc]">
              Job role
            </h2>
            <p className="mt-1 text-lg font-semibold text-white">
              {interviewData?.jobPosition}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c084fc]">
              Job description / stack
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#22d3ee]">{interviewData?.jobDesc}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c084fc]">
              Experience
            </h2>
            <p className="mt-1 text-sm text-[#22d3ee]">{interviewData?.jobExperience} years</p>
          </div>
          <div className="rounded-xl border border-[#22d3ee]/30 bg-[#0b1c12] p-4">
            <h3 className="flex items-center gap-2 font-semibold text-[#f5f0e8]">
              <Lightbulb className="h-5 w-5" />
              Before you start
            </h3>
            <p className="mt-2 text-sm text-[#22d3ee]">{process.env.NEXT_PUBLIC_INFORMATION}</p>
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
              <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-[#22d3ee]/20 bg-[#0b1c12]">
                <Camera className="h-16 w-16 text-[#c084fc]" />
              </div>
              <Button
                variant="secondary"
                className="mt-4 rounded-full bg-[#22d3ee] text-[#06180d] hover:bg-[#a855f7]"
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
