"use client"
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
    <section className="relative min-h-screen overflow-hidden bg-[#06180d] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_62%_42%,rgba(67,48,112,0.48),transparent_32%),radial-gradient(circle_at_42%_38%,rgba(21,37,39,0.72),transparent_36%),radial-gradient(circle_at_15%_30%,rgba(6,42,22,0.62),transparent_28%),linear-gradient(180deg,#071d10_0%,#06180d_48%,#041208_100%)]" />

      <div className="grid min-h-screen lg:grid-cols-2">

        <aside className="hidden flex-col justify-between bg-gradient-to-br from-[#0d2a18] via-[#12351f] to-[#0d2a18] p-12 text-white lg:flex border-r border-[#d4af37]/10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/[0.035] px-4 py-1.5 text-xs font-bold tracking-widest text-[#d4af37] uppercase">
              Intelligence Optimized
            </div>
            <h2 className="text-5xl font-black leading-[1.1] text-white">
              Practice interviews with confidence.
            </h2>
            <p className="text-sm text-[#b6a66d] leading-relaxed">
              CareerAI gives you realistic sessions tailored to your role so you can improve with every attempt.
            </p>
          </div>
          <div className="space-y-3">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-[#d4af37]/15 bg-[#0d2a18]/80 p-4 backdrop-blur-sm">
                <item.icon className="h-5 w-5 shrink-0 text-[#d4af37]" />
                <span className="text-sm font-medium text-white/90">{item.text}</span>
              </div>
            ))}

            <div className="mt-8 border-t border-[#d4af37]/15 pt-6">
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
                Join over 12,000+ candidates who improved their scores.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#a08c4a]">
              <ShieldCheck className="h-4 w-4" />
              Secured by CareerAI
            </div>
          </div>
        </aside>

        <main className="flex flex-col justify-center px-8 py-12 md:px-16">
          <BrandLogo showTagline />
          <h1 className="mt-8 text-3xl font-black text-white">
            Get <span className="text-[#d4af37]">started</span>
          </h1>
          <p className="mt-2 text-sm text-[#b6a66d]">
            Create your account and start practicing today.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#d4af37]/15 bg-[#0d2a18]/80 shadow-2xl shadow-black/30">
            <SignUp
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
          <p className="mt-4 text-sm text-[#b6a66d]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[#d4af37] hover:underline">
              Sign in
            </Link>
          </p>
        </main>

      </div>
    </section>
  );
}
