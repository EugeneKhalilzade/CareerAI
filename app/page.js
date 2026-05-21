import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, Mic, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/app/dashboard/_components/Footer";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import UpgradeBanner from "@/components/UpgradeBanner";

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
    <div className="flex min-h-screen flex-col">
      <header className="page-shell flex items-center justify-between py-6">
        <BrandLogo showTagline />
        <div className="flex items-center gap-2">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full px-6 bg-[#0ABAB5] hover:bg-[#09a8a3] text-white">
                Start Practicing
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="rounded-full px-6 bg-[#0ABAB5] hover:bg-[#09a8a3] text-white">
                Go to Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <UpgradeBanner />

      <main className="page-shell flex-1 space-y-6 pt-2 pb-12">

        {/* Hero */}
        <section className="glass-card overflow-hidden p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0ABAB5]/10 px-3 py-1 text-xs font-semibold text-[#0ABAB5]">
                <TimerReset className="h-4 w-4" />
                Faster interview preparation
              </div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
                Land your next role with{" "}
                <span className="block bg-gradient-to-r from-[#0ABAB5] via-[#56DFCF] to-[#0ABAB5] bg-clip-text text-transparent drop-shadow-sm">
                 CareerAI
                </span>
              </h1>
              <p className="text-base text-slate-500 md:text-lg leading-relaxed">
                Build confidence through AI-powered mock interviews, spoken responses,
                and practical feedback built around your real career goals.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-full px-8 bg-[#0ABAB5] hover:bg-[#09a8a3] text-white font-semibold"
                  >
                    Try CareerAI
                  </Button>
                </Link>
                <SignedOut>
                  <Link href="/sign-up">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 border-[#0ABAB5] text-[#0ABAB5] hover:bg-[#0ABAB5]/10"
                    >
                      Create account
                    </Button>
                  </Link>
                </SignedOut>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ADEED9]/40 to-[#FFEDF3]/40 blur-2xl" />
              <Image
                src="/Webinar-rafiki.svg"
                alt="Interview practice illustration"
                width={640}
                height={480}
                className="relative h-auto w-full drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-4 md:grid-cols-3">
          {featureList.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#0ABAB5]/10">
                <feature.icon className="h-5 w-5 text-[#0ABAB5]" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{feature.title}</h2>
              <p className="text-sm leading-6 text-slate-500">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="glass-card p-8 md:p-10">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900">
                How{" "}
                <span className="bg-gradient-to-r from-[#0ABAB5] to-[#56DFCF] bg-clip-text text-transparent">
                  CareerAI
                </span>{" "}
                works
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Three simple steps to transform your interview performance and
                build lasting professional confidence.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-[#ADEED9] bg-[#ADEED9]/20 px-5 py-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0ABAB5] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
