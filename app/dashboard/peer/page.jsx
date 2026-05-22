"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Calendar as CalendarIcon, ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function PeerLobby() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [joining, setJoining] = useState(false);

  const createRoom = () => {
    const newRoom = uuidv4().replace(/-/g, "").substring(0, 16);
    router.push(`/dashboard/peer/${newRoom}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim().length > 3) {
      setJoining(true);
      router.push(`/dashboard/peer/${roomId.trim()}`);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-card p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold text-[#d4af37]">
          <Users className="h-4 w-4" />
          Live Peer Practice
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white">
          Practice with real people
        </h1>
        <p className="mt-2 max-w-2xl text-[#b6a66d]">
          Create an instant live video room to practice with a friend, or join an existing session if you have a room link.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Instant Room */}
        <div className="glass-card flex flex-col items-center justify-center p-8 text-center transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10">
            <Plus className="h-8 w-8 text-[#d4af37]" />
          </div>
          <h2 className="text-xl font-bold text-white">Start a new session</h2>
          <p className="mt-2 text-sm text-[#b6a66d] mb-6">
            Instantly create a secure, private video room. You can invite a peer by sharing the link once inside.
          </p>
          <Button onClick={createRoom} className="rounded-full w-full max-w-xs bg-[#d4af37] text-[#06180d] hover:bg-[#f3d76b]">
            <Video className="mr-2 h-4 w-4" />
            Create instant room
          </Button>
        </div>

        {/* Join Existing Room */}
        <div className="glass-card p-8 transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1c12]">
              <ArrowRight className="h-5 w-5 text-[#d4af37]" />
            </div>
            <h2 className="text-xl font-bold text-white">Join a session</h2>
          </div>
          <p className="text-sm text-[#b6a66d] mb-6">
            Have a room code or link from a friend? Enter it below to hop right in.
          </p>
          
          <form onSubmit={joinRoom} className="space-y-4">
            <div>
              <Input
                placeholder="Enter room ID or paste link..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="rounded-xl border-[#d4af37]/20 bg-[#071109] text-white placeholder:text-white/30"
              />
            </div>
            <Button
              type="submit"
              disabled={roomId.trim().length <= 3 || joining}
              className="rounded-full w-full bg-[#d4af37] text-[#06180d] hover:bg-[#f3d76b]"
            >
              {joining ? "Joining..." : "Join room"}
            </Button>
          </form>
        </div>
      </div>

      {/* Schedule Banner */}
      <div className="rounded-2xl border border-[#d4af37]/20 bg-[#0b1c12] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37]/10 shrink-0">
            <CalendarIcon className="h-6 w-6 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="font-bold text-white">Schedule for later</h3>
            <p className="text-sm text-[#b6a66d]">
              Planning a session ahead of time? Add it to your calendar and we&apos;ll automatically generate a room link.
            </p>
          </div>
        </div>
        <Link href="/dashboard/calendar" className="shrink-0 w-full md:w-auto">
          <Button variant="outline" className="w-full rounded-full border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10">
            Open Calendar
          </Button>
        </Link>
      </div>
    </div>
  );
}
