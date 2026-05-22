import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, Mic, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/app/dashboard/_components/Footer";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import DarkShell from "@/components/DarkShell";


export default function Home() {
  const featureList = [
    {
      title: "Personalized questions",
      description: "Generate interview questions based on your role, stack, and experience level.",
      icon: BrainCircuit,
    },
    {
      title: "Voice-based practice",
      description: "Answer with your microphone and mimic real interview pressure.",
      icon: Mic,
    },
    {
      title: "Instant actionable feedback",
      description: "Get answer ratings and specific guidance to improve your next response.",
      icon: Sparkles,
    },
  ];

  const steps = [
    "Create an interview from your target role and tech stack",
    "Practice question-by-question using voice recording",
    "Review ratings, ideal answers, and improvement notes",
  ];

  return (
    <DarkShell className="flex flex-col">

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="page-shell flex h-20 items-center justify-between">
          <BrandLogo showTagline={false} />
          <div className="flex items-center gap-2">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white/80 hover:bg-white/5 hover:text-cyan-400">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="rounded-full bg-transparent px-5 font-semibold text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="rounded-full bg-transparent px-5 font-semibold text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                  Go to Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>



      <main className="relative flex-1 pt-20">

        {/* Hero */}
        <section className="page-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center">
          <div className="pointer-events-none absolute inset-0">
            {/* Ambient Radial Cyber Glows */}
            <div className="absolute top-[10%] left-[-15%] w-[650px] h-[650px] bg-purple-600/25 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-15%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[5%] left-[10%] w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

            <BrainCircuit className="absolute left-[8%] top-[23%] h-8 w-8 rotate-12 text-cyan-500/10" />
            <Mic className="absolute right-[12%] top-[24%] h-10 w-10 -rotate-12 text-purple-500/10" />
            <Sparkles className="absolute left-[18%] top-[48%] h-6 w-6 text-cyan-500/10" />
            <CheckCircle2 className="absolute right-[18%] top-[52%] h-7 w-7 text-purple-500/10" />
            <TimerReset className="absolute bottom-[24%] left-[12%] h-9 w-9 -rotate-6 text-cyan-500/5" />
            <BrainCircuit className="absolute bottom-[18%] right-[9%] h-8 w-8 rotate-6 text-purple-500/10" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
            <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-5 py-3 text-sm font-medium text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-powered interview practice
            </div>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.98] tracking-tight text-white md:text-8xl lg:text-[104px]">
              Land your next
              <span className="block">
                role with <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">CareerAI</span>
              </span>
            </h1>

            <p className="mt-9 max-w-3xl text-lg font-medium leading-8 text-slate-300 md:text-2xl md:leading-10">
              Build confidence through AI-powered mock interviews, spoken responses,
              and practical feedback built around your real career goals.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 px-8 text-base font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_40px_rgba(168,85,247,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-0"
                >
                  Get started <span className="ml-2 text-xl leading-none">&rarr;</span>
                </Button>
              </Link>
              <SignedOut>
                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-full border-2 border-cyan-500/40 bg-slate-950/40 px-8 text-base font-bold text-white hover:bg-slate-900/50 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Watch demo
                  </Button>
                </Link>
              </SignedOut>
            </div>

            <div className="mt-24 w-full relative">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-400/80">
                Trusted by professionals at
              </p>
              <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-12 gap-y-5 text-xl font-bold text-slate-400/70 md:text-2xl">
                <span>Google</span>
                <span>Meta</span>
                <span>Amazon</span>
                <span>Microsoft</span>
                <span>Apple</span>
              </div>
            </div>
          </div>

          {/* 3D perspective cyber grid floor */}
          <div className="absolute bottom-0 left-0 right-0 h-44 overflow-hidden pointer-events-none z-0">
            <div className="cyber-grid opacity-[0.22]" />
          </div>
        </section>

        {/* Features */}
        <section className="page-shell relative px-6 py-24 md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-400">
              Features
            </p>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
              Everything you need to ace your interview
            </h2>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {featureList.map((feature) => (
              <div
                key={feature.title}
                className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_20px_rgba(6,182,212,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:bg-[#080816]/90"
              >
                <div className="pointer-events-none absolute right-10 top-10 text-3xl font-light text-cyan-400/40 group-hover:text-cyan-400/90 transition-colors">
                  +
                </div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all">
                  <feature.icon className="h-7 w-7" />
                </div>
                <div className="my-10 h-28 rounded-xl border border-cyan-500/15 bg-slate-950/60 shadow-[inset_0_-20px_40px_rgba(6,182,212,0.08)] group-hover:border-cyan-400/30 group-hover:shadow-[inset_0_-20px_40px_rgba(168,85,247,0.1)] transition-all duration-300" />
                <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-5 text-lg leading-8 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="page-shell relative border-t border-purple-500/25 px-6 py-24 text-center md:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-purple-400">
            How it works
          </p>
          <h2 className="mx-auto mt-6 max-w-6xl text-4xl font-black tracking-tight text-white md:text-6xl">
            Three simple steps to transform your interview performance
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => {
              const StepIcon = index === 1 ? Mic : index === 2 ? CheckCircle2 : BrainCircuit;

              return (
                <div key={step} className="group relative flex flex-col items-center">
                  <div className="mb-8 text-6xl font-black text-cyan-500/20 group-hover:text-cyan-400/40 group-hover:scale-105 transition-all duration-300 md:text-7xl">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mb-8 h-px w-full bg-cyan-500/20 group-hover:bg-cyan-400/40 transition-colors" />
                  <div className="mb-9 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-500/30 bg-slate-950/90 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-all duration-300">
                    <StepIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {index === 0 ? "Create an interview" : index === 1 ? "Practice with voice" : "Review feedback"}
                  </h3>
                  <p className="mt-5 max-w-sm text-lg leading-8 text-slate-400">
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

      </main>
      <Footer />
    </DarkShell>
  );
}
