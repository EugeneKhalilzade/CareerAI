"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart2 } from "lucide-react";

// Utility: parse "DD-MM-YYYY" stored in createdAt
function parseDate(str) {
  if (!str) return null;
  // support both DD-MM-YYYY and YYYY-MM-DD
  const parts = str.split("-");
  if (parts.length !== 3) return null;
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  }
  // DD-MM-YYYY
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
}

function buildWeekSlots() {
  const slots = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    slots.push({
      label: days[d.getDay()],
      date: d,
      ratings: [],
    });
  }
  return slots;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-violet-600">
          {val !== null ? `${val} / 10` : "No data"}
        </p>
      </div>
    );
  }
  return null;
};

function WeeklyPerformanceChart() {
  const { user } = useUser();
  const [chartData, setChartData] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const answers = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

      const slots = buildWeekSlots();

      answers.forEach((ans) => {
        const rating = parseFloat(ans.rating);
        if (isNaN(rating)) return;
        const d = parseDate(ans.createdAt);
        if (!d) return;
        d.setHours(0, 0, 0, 0);
        const slot = slots.find(
          (s) => s.date.toDateString() === d.toDateString()
        );
        if (slot) slot.ratings.push(rating);
      });

      const data = slots.map((s) => ({
        day: s.label,
        score:
          s.ratings.length > 0
            ? parseFloat(
                (s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length).toFixed(1)
              )
            : null,
        count: s.ratings.length,
      }));

      // Fill nulls with 0 only for display (keep original null for tooltip logic)
      const displayData = data.map((d) => ({
        ...d,
        displayScore: d.score ?? 0,
      }));

      setChartData(displayData);

      const filled = data.filter((d) => d.score !== null);
      if (filled.length > 0) {
        const avg =
          filled.reduce((a, b) => a + b.score, 0) / filled.length;
        setAvgScore(avg.toFixed(1));
      } else {
        setAvgScore(null);
      }
    } catch (err) {
      console.error("WeeklyPerformanceChart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const trend =
    chartData.length >= 2
      ? (() => {
          const filled = chartData.filter((d) => d.score !== null);
          if (filled.length < 2) return null;
          return filled[filled.length - 1].score - filled[0].score;
        })()
      : null;

  return (
    <section className="glass-card p-6 md:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            <BarChart2 className="h-3.5 w-3.5" />
            Weekly overview
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Performance this week
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Average AI rating per answer across the last 7 days
          </p>
        </div>

        {/* Stats pills */}
        <div className="flex gap-3 flex-wrap">
          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-center min-w-[90px]">
            <p className="text-xs text-slate-500 font-medium">Avg score</p>
            <p className="mt-0.5 text-2xl font-bold text-violet-600">
              {loading ? "—" : avgScore !== null ? avgScore : "—"}
            </p>
          </div>
          {trend !== null && (
            <div
              className={`rounded-xl border px-4 py-3 text-center min-w-[90px] ${
                trend >= 0
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-rose-100 bg-rose-50"
              }`}
            >
              <p className="text-xs text-slate-500 font-medium">Trend</p>
              <p
                className={`mt-0.5 text-2xl font-bold flex items-center justify-center gap-0.5 ${
                  trend >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                <TrendingUp
                  className={`h-5 w-5 ${trend < 0 ? "rotate-180" : ""}`}
                />
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex h-52 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      ) : chartData.every((d) => d.score === null) ? (
        <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60">
          <p className="text-sm text-slate-400">
            No interview answers yet this week. Complete a session to see your chart.
          </p>
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="displayScore"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
                dot={(props) => {
                  const { cx, cy, index } = props;
                  const item = chartData[index];
                  if (item.score === null) return null;
                  return (
                    <circle
                      key={index}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#7c3aed"
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 7, fill: "#7c3aed", stroke: "white", strokeWidth: 2 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Day answer counts */}
      {!loading && chartData.some((d) => d.score !== null) && (
        <div className="flex gap-2 flex-wrap">
          {chartData.map((d) => (
            <div
              key={d.day}
              className={`flex flex-col items-center rounded-lg px-3 py-1.5 text-xs ${
                d.count > 0
                  ? "bg-violet-50 text-violet-700"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              <span className="font-semibold">{d.day}</span>
              <span>{d.count} ans</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WeeklyPerformanceChart;
