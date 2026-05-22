"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { BrainCircuit, CheckCircle2, Mic, ShieldCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isSignedIn) router.push("/dashboard");
  }, [isSignedIn, router]);

  const highlights = [
    { icon: BrainCircuit, text: "Create role-specific question sets" },
    { icon: Mic, text: "Practice spoken responses naturally" },
    { icon: Sparkles, text: "Learn from instant answer feedback" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#06180d] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_62%_42%,rgba(67,48,112,0.48),transparent_32%),radial-gradient(circle_at_42%_38%,rgba(21,37,39,0.72),transparent_36%),radial-gradient(circle_at_15%_30%,rgba(6,42,22,0.62),transparent_28%),linear-gradient(180deg,#071d10_0%,#06180d_48%,#041208_100%)]" />

      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <main className="flex items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-[460px]">
            <div className="mb-9 flex justify-center">
              <BrandLogo showTagline />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              Welcome <span className="text-[#d4af37]">back</span>
            </h1>
            <p className="mt-3 text-sm text-[#b6a66d]">
              Sign in to continue your interview preparation.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-[#d4af37]/15 bg-[#0d2a18]/80 shadow-2xl shadow-black/30">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full border-0 shadow-none rounded-none bg-transparent",
                    headerTitle: "text-white",
                    headerSubtitle: "text-[#b6a66d]",
                    socialButtonsBlockButton:
                      "border-[#d4af37]/20 text-white/80 hover:bg-[#d4af37]/10 bg-[#0a1f12]",
                    formFieldLabel: "text-[#b6a66d]",
                    formFieldInput:
                      "bg-[#071109] border-[#d4af37]/20 text-white placeholder:text-white/30 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20",
                    formButtonPrimary:
                      "bg-[#d4af37] hover:bg-[#f3d76b] text-[#06180d] shadow-lg shadow-[#d4af37]/20 font-bold",
                    footerActionLink: "text-[#d4af37] font-semibold",
                    dividerLine: "bg-[#d4af37]/15",
                    dividerText: "text-[#b6a66d]",
                    footer: "bg-transparent",
                    footerAction: "text-[#b6a66d]",
                  },
                }}
              />
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-[#b6a66d]">
              New to CareerAI?{" "}
              <Link href="/sign-up" className="text-[#d4af37] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </main>

        <aside className="hidden min-h-screen w-full flex-col justify-center bg-gradient-to-br from-[#0d2a18] via-[#12351f] to-[#0d2a18] px-16 py-12 text-white lg:flex border-l border-[#d4af37]/10">
          <div className="mx-auto w-full max-w-[440px]">
            <div className="mb-5 inline-flex rounded-full border border-[#d4af37]/20 bg-white/[0.035] px-5 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#d4af37]">
              Intelligence Optimized
            </div>
            <h2 className="text-5xl font-black leading-[1.04] tracking-tight text-white drop-shadow-sm">
              Build strong answers and better confidence with each practice round.
            </h2>

            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item.text}
                  className="flex h-14 items-center gap-4 rounded-xl border border-[#d4af37]/15 bg-[#0d2a18]/80 px-5 shadow-lg shadow-black/10 backdrop-blur"
                >
                  <item.icon className="h-5 w-5 text-[#d4af37]" />
                  <span className="text-sm font-semibold text-white/90">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-[#d4af37]/15 pt-7">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37] text-xs font-black text-[#06180d]">
                  AI
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12351f] text-xs font-black text-white border border-[#d4af37]/20">
                  JR
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d2a18] text-xs font-black text-[#d4af37] border border-[#d4af37]/20">
                  LM
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white/80 ring-1 ring-white/10">
                  +12k
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#b6a66d]">
                <Users className="h-4 w-4" />
                Join over 12,000+ candidates who improved their interview scores by 40%.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#a08c4a]">
              <ShieldCheck className="h-4 w-4" />
              Secured by CareerAI
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
