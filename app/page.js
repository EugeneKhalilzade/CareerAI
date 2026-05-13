import Image from "next/image";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, Mic, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/app/dashboard/_components/Footer";

export default function Home() {
  const featureList = [
    {
      title: "Personalized questions",
      description:
        "Generate interview questions based on your role, stack, and experience level.",
      icon: BrainCircuit,
    },
    {
      title: "Voice-based practice",
      description:
        "Answer with your microphone and mimic real interview pressure.",
      icon: Mic,
    },
    {
      title: "Instant actionable feedback",
      description:
        "Get answer ratings and specific guidance to improve your next response.",
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
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-full px-6">Start Practicing</Button>
          </Link>
        </div>
      </header>

      <main className="page-shell flex-1 space-y-8 pt-2">
        <section className="glass-card overflow-hidden p-6 md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <TimerReset className="h-4 w-4" />
                Faster interview preparation
              </div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                Land your next role with <span className="brand-highlight">KaryerA</span>I
              </h1>
              <p className="text-base text-slate-600 md:text-lg">
                Build confidence through AI-powered mock interviews, spoken responses,
                and practical feedback built around your real career goals.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8">
                    Try KaryerAI
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    Create account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <Image
                src="/Webinar-rafiki.svg"
                alt="Interview practice illustration"
                width={640}
                height={480}
                className="h-auto w-full drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {featureList.map((feature) => (
            <div key={feature.title} className="glass-card p-5">
              <feature.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="glass-card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900">How KaryerAI works</h2>
          <div className="mt-5 space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-slate-700 md:text-base">
                  <span className="mr-2 font-semibold text-slate-900">{index + 1}.</span>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
