import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, Mic, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/app/dashboard/_components/Footer";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";


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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#06180d] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_62%_42%,rgba(67,48,112,0.48),transparent_32%),radial-gradient(circle_at_42%_38%,rgba(21,37,39,0.72),transparent_36%),radial-gradient(circle_at_15%_30%,rgba(6,42,22,0.62),transparent_28%),linear-gradient(180deg,#071d10_0%,#06180d_48%,#041208_100%)]" />

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#071109]/80 backdrop-blur-xl">
        <div className="page-shell flex h-20 items-center justify-between">
          <BrandLogo showTagline={false} />
          <div className="flex items-center gap-2">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white/80 hover:bg-white/5 hover:text-[#d4af37]">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="rounded-full bg-transparent px-5 font-semibold text-[#d4af37] hover:bg-white/5 hover:text-[#f3d76b]">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="rounded-full bg-transparent px-5 font-semibold text-[#d4af37] hover:bg-white/5 hover:text-[#f3d76b]">
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
            <BrainCircuit className="absolute left-[8%] top-[23%] h-8 w-8 rotate-12 text-[#d4af37]/5" />
            <Mic className="absolute right-[12%] top-[24%] h-10 w-10 -rotate-12 text-white/[0.04]" />
            <Sparkles className="absolute left-[18%] top-[48%] h-6 w-6 text-[#d4af37]/10" />
            <CheckCircle2 className="absolute right-[18%] top-[52%] h-7 w-7 text-emerald-200/[0.05]" />
            <TimerReset className="absolute bottom-[24%] left-[12%] h-9 w-9 -rotate-6 text-white/[0.035]" />
            <BrainCircuit className="absolute bottom-[18%] right-[9%] h-8 w-8 rotate-6 text-[#d4af37]/5" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
            <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/[0.035] px-5 py-3 text-sm font-medium text-[#d4af37] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-powered interview practice
            </div>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.98] tracking-tight text-white md:text-8xl lg:text-[104px]">
              Land your next
              <span className="block">
                role with <span className="text-[#d4af37]">CareerAI</span>
              </span>
            </h1>

            <p className="mt-9 max-w-3xl text-lg font-medium leading-8 text-[#b6a66d] md:text-2xl md:leading-10">
              Build confidence through AI-powered mock interviews, spoken responses,
              and practical feedback built around your real career goals.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-[#f5f0e8] px-8 text-base font-bold text-[#080c14] shadow-[0_18px_40px_rgba(245,240,232,0.12)] hover:bg-white hover:text-[#080c14]"
                >
                  Get started <span className="ml-2 text-xl leading-none">&rarr;</span>
                </Button>
              </Link>
              <SignedOut>
                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-full border border-white/10 bg-[#031008] px-8 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#0d1b12] hover:text-[#d4af37]"
                  >
                    Watch demo
                  </Button>
                </Link>
              </SignedOut>
            </div>

            <div className="mt-24 w-full">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a08c4a]">
                Trusted by professionals at
              </p>
              <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-12 gap-y-5 text-xl font-bold text-[#7f754a]/70 md:text-2xl">
                <span>Google</span>
                <span>Meta</span>
                <span>Amazon</span>
                <span>Microsoft</span>
                <span>Apple</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="page-shell relative px-6 py-24 md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#a08c4a]">
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
                className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-[#d4af37]/15 bg-[#0d2a18]/80 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-[0_0_45px_rgba(212,175,55,0.18)]"
              >
                <div className="pointer-events-none absolute right-10 top-10 text-3xl font-light text-[#d4af37]/35">
                  +
                </div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#06140b] text-white shadow-[0_16px_35px_rgba(0,0,0,0.24)] ring-1 ring-white/5">
                  <feature.icon className="h-7 w-7" />
                </div>
                <div className="my-10 h-28 rounded-xl border border-black/10 bg-[#06140b]/35 shadow-[inset_0_-28px_50px_rgba(0,0,0,0.22)]" />
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-5 text-lg leading-8 text-[#b6a66d]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="page-shell relative border-t border-[#d4af37]/15 px-6 py-24 text-center md:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#a08c4a]">
            How it works
          </p>
          <h2 className="mx-auto mt-6 max-w-6xl text-4xl font-black tracking-tight text-white md:text-6xl">
            Three simple steps to transform your interview performance
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => {
              const StepIcon = index === 1 ? Mic : index === 2 ? CheckCircle2 : BrainCircuit;

              return (
                <div key={step} className="relative flex flex-col items-center">
                  <div className="mb-8 text-6xl font-black text-[#d4af37]/20 md:text-7xl">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mb-8 h-px w-full bg-[#d4af37]/15" />
                  <div className="mb-9 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4af37]/10 bg-[#12351f] text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                    <StepIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {index === 0 ? "Create an interview" : index === 1 ? "Practice with voice" : "Review feedback"}
                  </h3>
                  <p className="mt-5 max-w-sm text-lg leading-8 text-[#b6a66d]">
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
