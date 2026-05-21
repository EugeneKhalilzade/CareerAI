"use client"
import { SignIn, useAuth } from "@clerk/nextjs";
import { BrainCircuit, Mic, Sparkles } from "lucide-react";
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
    <section className="min-h-screen bg-[#ADEED9]/20">
      <div className="grid min-h-screen lg:grid-cols-2">

        <aside className="hidden flex-col justify-between bg-gradient-to-br from-[#0ABAB5] via-[#56DFCF] to-[#0ABAB5] p-12 text-white lg:flex">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase">
              Intelligence Optimized
            </div>
            <h2 className="text-5xl font-black leading-[1.1]">
              Practice interviews with confidence.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              KaryerAI gives you realistic sessions tailored to your role so you can improve with every attempt.
            </p>
          </div>
          <div className="space-y-3">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur-sm border border-white/10">
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex flex-col justify-center px-8 py-12 md:px-16">
          <BrandLogo showTagline />
          <h1 className="mt-8 text-3xl font-black text-slate-900">
            Welcome <span className="text-[#0ABAB5]">back</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue your interview preparation.
          </p>
          <div className="mt-6">
            <SignIn />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            New to KaryerAI?{" "}
            <Link href="/sign-up" className="font-semibold text-[#0ABAB5] hover:underline">
              Create an account
            </Link>
          </p>
        </main>

      </div>
    </section>
  );
}
