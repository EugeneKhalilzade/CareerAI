import { SignUp } from "@clerk/nextjs";
import { Activity, ClipboardCheck, Mic, ShieldCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const highlights = [
    { icon: ClipboardCheck, text: "Create role-specific question sets" },
    { icon: Mic, text: "Practice spoken responses naturally" },
    { icon: Sparkles, text: "Learn from instant answer feedback" },
  ];

  return (
    <section className="min-h-screen overflow-hidden bg-[#EFFFFC]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <main className="flex items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-[460px]">
            <div className="mb-9 flex justify-center">
              <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-[#6F49D8]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6F49D8] text-white shadow-lg shadow-[#6F49D8]/20">
                  <Activity className="h-5 w-5" />
                </span>
                    CareerAI
              </Link>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              Create your <span className="text-[#6F49D8]">account</span>
            </h1>
            <p className="mt-3 text-sm text-slate-600">
                Join CareerAI and start practicing role-based interviews today.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-teal-950/10 ring-1 ring-teal-100">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full border-0 shadow-none rounded-none",
                    headerTitle: "text-slate-950",
                    headerSubtitle: "text-slate-500",
                    socialButtonsBlockButton:
                      "border-[#8DE7DC] text-slate-700 hover:bg-[#EFFFFC]",
                    formButtonPrimary:
                      "bg-[#6F49D8] hover:bg-[#5D3CC4] shadow-lg shadow-[#6F49D8]/20",
                    footerActionLink: "text-slate-900 font-semibold",
                  },
                }}
              />
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-slate-700">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-slate-950 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </main>

        <aside className="hidden min-h-screen w-full flex-col justify-center bg-gradient-to-br from-[#6366F1] via-[#0891B2] to-[#0ABAB5] px-16 py-12 text-white lg:flex">
          <div className="mx-auto w-full max-w-[440px]">
            <div className="mb-5 inline-flex rounded-full bg-white/[0.18] px-5 py-1.5 text-[11px] font-black uppercase tracking-wide text-white ring-1 ring-white/20">
              Intelligence Optimized
            </div>
            <h2 className="text-5xl font-black leading-[1.04] tracking-tight drop-shadow-sm">
              Build strong answers and better confidence with each practice round.
            </h2>

            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item.text}
                  className="flex h-14 items-center gap-4 rounded-xl border border-white/15 bg-white/[0.14] px-5 shadow-lg shadow-teal-950/5 backdrop-blur"
                >
                  <item.icon className="h-5 w-5 text-[#EFFFFC]" />
                  <span className="text-sm font-semibold">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-white/20 pt-7">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#0ABAB5]">
                  AI
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6F49D8] text-xs font-black text-white">
                  JR
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFEDF3] text-xs font-black text-[#6F49D8]">
                  LM
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-black text-white ring-1 ring-white/20">
                  +12k
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/90">
                <Users className="h-4 w-4" />
                Join over 12,000+ candidates who improved their interview scores by 40%.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-white/70">
              <ShieldCheck className="h-4 w-4" />
                Secured by CareerAI
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
