"use client"; // Neon theme applied
import { SignUp, useAuth } from "@clerk/nextjs";
import { BrainCircuit, Mic, Sparkles, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isSignedIn) router.push("/dashboard");
  }, [isSignedIn]);

  const highlights = [
    { icon: BrainCircuit, text: "Role-specific interview questions" },
    { icon: Mic, text: "Voice-based answer practice" },
    { icon: Sparkles, text: "Instant scoring and feedback" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080812] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_62%_42%,rgba(67,48,112,0.48),transparent_32%),radial-gradient(circle_at_42%_38%,rgba(21,37,50,0.72),transparent_36%),radial-gradient(circle_at_15%_30%,rgba(15,15,35,0.62),transparent_28%),linear-gradient(180deg,#0a0a1a_0%,#080812_48%,#040408_100%)]" />

      <div className="grid min-h-screen lg:grid-cols-2">

        <aside className="hidden flex-col justify-between bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a] p-12 text-white lg:flex border-r border-[#22d3ee]/10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/20 bg-white/[0.035] px-4 py-1.5 text-xs font-bold tracking-widest text-[#22d3ee] uppercase">
              Intelligence Optimized
            </div>
            <h2 className="text-5xl font-black leading-[1.1] text-white">
              Practice interviews with confidence.
            </h2>
            <p className="text-sm text-[#22d3ee] leading-relaxed">
              CareerAI gives you realistic sessions tailored to your role so you can improve with every attempt.
            </p>
          </div>
          <div className="space-y-3">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-[#22d3ee]/15 bg-[#0a0a1a]/80 p-4 backdrop-blur-sm">
                <item.icon className="h-5 w-5 shrink-0 text-[#22d3ee]" />
                <span className="text-sm font-medium text-white/90">{item.text}</span>
              </div>
            ))}

            <div className="mt-8 border-t border-[#22d3ee]/15 pt-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22d3ee] text-xs font-black text-[#06180d]">
                  AI
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d0d2b] text-xs font-black text-white border border-[#22d3ee]/20">
                  JR
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0a1a] text-xs font-black text-[#22d3ee] border border-[#22d3ee]/20">
                  LM
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white/80 ring-1 ring-white/10">
                  +12k
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#22d3ee]">
                <Users className="h-4 w-4" />
                Join over 12,000+ candidates who improved their scores.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#c084fc]">
              <ShieldCheck className="h-4 w-4" />
              Secured by CareerAI
            </div>
          </div>
        </aside>

        <main className="flex flex-col justify-center px-8 py-12 md:px-16">
          <BrandLogo showTagline />
          <h1 className="mt-8 text-3xl font-black text-white">
            Get <span className="text-[#22d3ee]">started</span>
          </h1>
          <p className="mt-2 text-sm text-[#22d3ee]">
            Create your account and start practicing today.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#22d3ee]/15 bg-[#0a0a1a]/80 shadow-2xl shadow-black/30">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full border-0 shadow-none rounded-none bg-transparent",
                  headerTitle: "text-white",
                  headerSubtitle: "text-[#22d3ee]",
                  socialButtonsBlockButton:
                    "border-[#22d3ee]/20 text-white/80 hover:bg-[#22d3ee]/10 bg-[#0d0d2b]",
                  formFieldLabel: "text-[#22d3ee]",
                  formFieldInput:
                    "bg-[#040408] border-[#22d3ee]/20 text-white placeholder:text-white/30 focus:border-[#22d3ee]/50 focus:ring-[#22d3ee]/20",
                  formButtonPrimary:
                    "bg-[#22d3ee] hover:bg-[#a855f7] text-[#06180d] shadow-lg shadow-[#22d3ee]/20 font-bold",
                  footerActionLink: "text-[#22d3ee] font-semibold",
                  dividerLine: "bg-[#22d3ee]/15",
                  dividerText: "text-[#22d3ee]",
                  footer: "bg-transparent",
                  footerAction: "text-[#22d3ee]",
                },
              }}
            />
          </div>
          <p className="mt-4 text-sm text-[#22d3ee]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[#22d3ee] hover:underline">
              Sign in
            </Link>
          </p>
        </main>

      </div>
    </section>
  );
}
