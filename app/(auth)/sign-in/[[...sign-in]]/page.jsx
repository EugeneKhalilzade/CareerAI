"use client"
import { SignIn,useAuth } from "@clerk/nextjs";
import { BrainCircuit, Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const {isSignedIn}=useAuth();
  const router=useRouter()
  useEffect(()=>{
     if(isSignedIn){
      router.push("/dashboard")
     }
  },[isSignedIn])

  const highlights = [
    { icon: BrainCircuit, text: "Role-specific interview questions" },
    { icon: Mic, text: "Voice-based answer practice" },
    { icon: Sparkles, text: "Instant scoring and feedback" },
  ];

  return (
    <section className="min-h-screen py-6">
      <div className="page-shell grid gap-6 lg:grid-cols-2">
        <aside className="glass-card hidden flex-col justify-between bg-gradient-to-br from-primary via-violet-600 to-cyan-500 p-8 text-white lg:flex">
          <div>
            <BrandLogo className="text-white [&_span:first-child]:text-white" />
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              Practice interviews with confidence
            </h2>
            <p className="mt-3 text-sm text-white/90">
              KaryerAI gives you realistic sessions tailored to your role so you can improve with every attempt.
            </p>
          </div>

          <div className="space-y-3">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="glass-card flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <BrandLogo showTagline />
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to continue your interview preparation.
            </p>

            <div className="mt-6">
              <SignIn />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              New to KaryerAI?{" "}
              <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}
