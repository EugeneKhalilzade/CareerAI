import { SignUp } from "@clerk/nextjs";
import { ClipboardCheck, Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Page() {
  const highlights = [
    { icon: ClipboardCheck, text: "Create role-specific question sets" },
    { icon: Mic, text: "Practice spoken responses naturally" },
    { icon: Sparkles, text: "Learn from instant answer feedback" },
  ];

  return (
    <section className="min-h-screen py-6">
      <div className="page-shell grid gap-6 lg:grid-cols-2">
        <main className="glass-card flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <BrandLogo showTagline />
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-600">
              Join KaryerAI and start practicing role-based interviews today.
            </p>

            <div className="mt-6">
              <SignUp />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </main>

        <aside className="glass-card hidden flex-col justify-between bg-gradient-to-br from-cyan-500 via-primary to-fuchsia-600 p-8 text-white lg:flex">
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Get interview-ready faster with KaryerAI
            </h2>
            <p className="mt-3 text-sm text-white/90">
              Build strong answers and better confidence with each practice round.
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
      </div>
    </section>
  );
}
