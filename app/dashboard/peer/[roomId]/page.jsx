"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, CheckCheck, Share2 } from "lucide-react";

export default function PeerRoom({ params }) {
  const { roomId } = params;
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRoomUrl(`${window.location.origin}/dashboard/peer/${roomId}`);
    }
  }, [roomId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
      </div>
    );
  }

  // Use clerk display name or fallback
  const displayName = user?.fullName || user?.firstName || "Guest User";
  const email = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between glass-card p-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/peer")}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Leave Room
          </Button>
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <h2 className="hidden sm:block font-bold text-slate-800">
            Room: <span className="text-slate-500 font-mono text-sm">{roomId}</span>
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition rounded-full px-4"
        >
          {copied ? (
            <>
              <CheckCheck className="mr-2 h-4 w-4 text-emerald-500" /> Link Copied
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" /> Invite Peer
            </>
          )}
        </Button>
      </div>

      {/* Jitsi Video Area */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative">
        <JitsiMeeting
          domain="meet.jit.si"
            roomName={`CareerAI-Peer-${roomId}`}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false,
            prejoinPageEnabled: false, // Skip prejoin, user is already authenticated with Clerk
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          userInfo={{
            displayName: displayName,
            email: email,
          }}
          onApiReady={(externalApi) => {
            // Optional: attach listeners to externalApi if needed
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
        />
      </div>
    </div>
  );
}
