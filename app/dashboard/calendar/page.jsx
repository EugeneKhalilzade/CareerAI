"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { CalendarEvent } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import moment from "moment";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Pencil,
  Trash2,
  CalendarDays,
  StickyNote,
  BriefcaseBusiness,
  Clock,
  CheckCircle2,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// ─── helpers ────────────────────────────────────────────────────────────────
const TODAY = moment().format("YYYY-MM-DD");

function daysInMonth(year, month) {
  return new Array(moment({ year, month }).daysInMonth())
    .fill(null)
    .map((_, i) => moment({ year, month, day: i + 1 }));
}

function leadingBlanks(year, month) {
  return new Array(moment({ year, month, day: 1 }).day()).fill(null);
}

const TYPE_META = {
  note: {
    label: "Note",
    color: "bg-cyan-500",
    light: "bg-cyan-50 border-cyan-200 text-cyan-700",
    icon: StickyNote,
  },
  interview: {
    label: "Mock Interview",
    color: "bg-violet-500",
    light: "bg-violet-50 border-violet-200 text-violet-700",
    icon: BriefcaseBusiness,
  },
  peer: {
    label: "Peer Practice",
    color: "bg-blue-500",
    light: "bg-blue-50 border-blue-200 text-blue-700",
    icon: Users,
  },
};

// ─── EventForm ───────────────────────────────────────────────────────────────
function EventForm({ date, existing, onSave, onCancel }) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [time, setTime] = useState(existing?.time ?? "");
  const [type, setType] = useState(existing?.type ?? "note");
  const [saving, setSaving] = useState(false);

  const valid = title.trim().length > 0;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    await onSave({ title: title.trim(), notes, time, type });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {/* Type toggle */}
      <div className="flex gap-2">
        {Object.entries(TYPE_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-medium transition-all ${
                type === key
                  ? `${meta.light} border-current`
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === "interview" ? "e.g. Frontend Engineer prep" : "e.g. Review system design"}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Time */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Time (optional)
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add any details, goals, or reminders…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" size="sm" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1 rounded-xl"
          disabled={!valid || saving}
          onClick={handleSave}
        >
          {saving ? "Saving…" : existing ? "Update" : "Add Event"}
        </Button>
      </div>
    </div>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────────
function EventCard({ event, onEdit, onDelete }) {
  const meta = TYPE_META[event.type] ?? TYPE_META.note;
  const Icon = meta.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 ${meta.light}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-sm">{event.title}</p>
        {event.time && (
          <p className="mt-0.5 flex items-center gap-1 text-xs opacity-75">
            <Clock className="h-3 w-3" /> {event.time}
          </p>
        )}
        {event.notes && (
          <p className="mt-1 text-xs opacity-80 line-clamp-2">{event.notes}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onEdit(event)}
          className="rounded-lg p-1 opacity-60 hover:bg-black/10 hover:opacity-100 transition"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="rounded-lg p-1 opacity-60 hover:bg-black/10 hover:opacity-100 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { user } = useUser();
  const router = useRouter();
  const [cursor, setCursor] = useState(moment());          // which month we're viewing
  const [selected, setSelected] = useState(TODAY);         // selected day YYYY-MM-DD
  const [events, setEvents] = useState([]);                // all events for this user
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);      // event being edited

  const email = user?.primaryEmailAddress?.emailAddress;

  // ── fetch all events ──────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const rows = await db
        .select()
        .from(CalendarEvent)
        .where(eq(CalendarEvent.userEmail, email));
      setEvents(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // ── event helpers ─────────────────────────────────────────────────────────
  const eventsForDay = (dateStr) =>
    events.filter((e) => e.date === dateStr);

  const handleSave = async ({ title, notes, time, type }) => {
    try {
      let finalNotes = notes;
      if (type === "peer" && !editTarget) {
        const newRoom = uuidv4().replace(/-/g, "").substring(0, 16);
        const linkStr = `Room Link: /dashboard/peer/${newRoom}`;
        finalNotes = notes ? `${notes}\n\n${linkStr}` : linkStr;
      }

      if (editTarget) {
        // update — drizzle neon-http doesn't support update().returning(), rebuild manually
        await db
          .update(CalendarEvent)
          .set({ title, notes: finalNotes, time, type })
          .where(eq(CalendarEvent.id, editTarget.id));
        toast.success("Event updated");
      } else {
        await db.insert(CalendarEvent).values({
          title,
          notes: finalNotes,
          time,
          type,
          date: selected,
          userEmail: email,
          createdAt: moment().format("YYYY-MM-DD"),
        });
        toast.success("Event added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    setShowForm(false);
    setEditTarget(null);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    try {
      await db.delete(CalendarEvent).where(eq(CalendarEvent.id, id));
      toast.success("Event removed");
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete event");
    }
  };

  const openEdit = (event) => {
    setEditTarget(event);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  // ── calendar grid values ──────────────────────────────────────────────────
  const year = cursor.year();
  const month = cursor.month();
  const blanks = leadingBlanks(year, month);
  const days = daysInMonth(year, month);
  const selectedEvents = eventsForDay(selected);
  const selectedMoment = moment(selected);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="glass-card p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          <CalendarDays className="h-3.5 w-3.5" />
          Plan &amp; prepare
        </div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Interview Calendar
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Schedule mock interview sessions, drop notes, and keep your prep
          organised — all in one place.
        </p>
      </section>

      {/* Calendar + side-panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Calendar grid ─────────────────────────────────────────── */}
        <div className="glass-card overflow-hidden">
          {/* month navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <button
              onClick={() => setCursor(cursor.clone().subtract(1, "month"))}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">
              {cursor.format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setCursor(cursor.clone().add(1, "month"))}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* weekday labels */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* day cells */}
          <div className="grid grid-cols-7">
            {/* blank leading cells */}
            {blanks.map((_, i) => (
              <div key={`b${i}`} className="min-h-[80px] border-b border-r border-slate-100/60" />
            ))}

            {days.map((day) => {
              const dateStr = day.format("YYYY-MM-DD");
              const isToday = dateStr === TODAY;
              const isSelected = dateStr === selected;
              const dayEvents = eventsForDay(dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setSelected(dateStr);
                    setShowForm(false);
                    setEditTarget(null);
                  }}
                  className={`relative min-h-[80px] cursor-pointer border-b border-r border-slate-100/60 p-2 transition-colors
                    ${isSelected ? "bg-violet-50 ring-inset ring-2 ring-violet-400" : "hover:bg-slate-50"}
                  `}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium
                      ${isToday ? "bg-violet-600 text-white" : isSelected ? "text-violet-700 font-bold" : "text-slate-700"}
                    `}
                  >
                    {day.date()}
                  </span>

                  {/* event dots / chips */}
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight text-white ${TYPE_META[ev.type]?.color ?? "bg-slate-400"}`}
                      >
                        {ev.title}
                      </span>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Side panel ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* selected day header */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Selected day
                </p>
                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {selectedMoment.format("dddd, MMM D")}
                </p>
              </div>
              <button
                onClick={openAdd}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow hover:bg-violet-700 transition"
                title="Add event"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* add/edit form */}
          {showForm && (
            <div className="glass-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-slate-900 text-sm">
                  {editTarget ? "Edit event" : `New event — ${selectedMoment.format("MMM D")}`}
                </p>
                <button
                  onClick={() => { setShowForm(false); setEditTarget(null); }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <EventForm
                date={selected}
                existing={editTarget}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditTarget(null); }}
              />
            </div>
          )}

          {/* events list */}
          <div className="glass-card flex-1 p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              {selectedEvents.length > 0
                ? `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""}`
                : "No events"}
            </p>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CalendarDays className="h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-400">
                  Nothing planned. Hit <strong>+</strong> to add an event.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEvents
                  .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
                  .map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}

                {/* shortcut: if there's an interview event, offer quick-launch */}
                {selectedEvents.some((e) => e.type === "interview") && (
                  <button
                    onClick={() => router.push("/dashboard#new-interview")}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Start a mock interview now
                  </button>
                )}

                {/* shortcut: if there's a peer event, offer quick-launch */}
                {selectedEvents.some((e) => e.type === "peer") && (
                  <button
                    onClick={() => router.push("/dashboard/peer")}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Video className="h-4 w-4" />
                    Open Peer Lobby
                  </button>
                )}
              </div>
            )}
          </div>

          {/* legend */}
          <div className="glass-card p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Legend
            </p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(TYPE_META).map(([key, meta]) => {
                const Icon = meta.icon;
                return (
                  <div key={key} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${meta.color}`} />
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    {meta.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
