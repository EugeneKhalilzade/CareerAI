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
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
          <Users className="h-4 w-4" />
          Live Peer Practice
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Practice with real people
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Create an instant live video room to practice with a friend, or join an existing session if you have a room link.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Instant Room */}
        <div className="glass-card flex flex-col items-center justify-center p-8 text-center transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
            <Plus className="h-8 w-8 text-cyan-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Start a new session</h2>
          <p className="mt-2 text-sm text-slate-600 mb-6">
            Instantly create a secure, private video room. You can invite a peer by sharing the link once inside.
          </p>
          <Button onClick={createRoom} className="rounded-full w-full max-w-xs bg-cyan-600 hover:bg-cyan-700">
            <Video className="mr-2 h-4 w-4" />
            Create instant room
          </Button>
        </div>

        {/* Join Existing Room */}
        <div className="glass-card p-8 transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <ArrowRight className="h-5 w-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Join a session</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Have a room code or link from a friend? Enter it below to hop right in.
          </p>
          
          <form onSubmit={joinRoom} className="space-y-4">
            <div>
              <Input
                placeholder="Enter room ID or paste link..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <Button
              type="submit"
              disabled={roomId.trim().length <= 3 || joining}
              className="rounded-full w-full"
            >
              {joining ? "Joining..." : "Join room"}
            </Button>
          </form>
        </div>
      </div>

      {/* Schedule Banner */}
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 shrink-0">
            <CalendarIcon className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Schedule for later</h3>
            <p className="text-sm text-slate-600">
              Planning a session ahead of time? Add it to your calendar and we'll automatically generate a room link.
            </p>
          </div>
        </div>
        <Link href="/dashboard/calendar" className="shrink-0 w-full md:w-auto">
          <Button variant="outline" className="w-full rounded-full border-violet-200 text-violet-700 hover:bg-violet-100">
            Open Calendar
          </Button>
        </Link>
      </div>
    </div>
  );
}
