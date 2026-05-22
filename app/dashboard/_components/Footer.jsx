import Link from "next/link";
import React from "react";
import BrandLogo from "@/components/BrandLogo";
import { Github } from "lucide-react";

function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-cyan-500/20 bg-gradient-to-b from-[#080816] to-[#05050f] py-12 md:py-16 backdrop-blur-xl">
      {/* Cyber Neon Ambient Glow Backlights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      <div className="page-shell relative z-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-purple-400">
              Brand
            </h3>
            <div className="flex flex-col gap-2">
              <BrandLogo className="w-fit" />
              <p className="text-sm text-slate-400">
                Practice smarter, interview better.
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-purple-400">
              Contact
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="mailto:xelilzadeelgun4@gmail.com"
                  className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400 break-all"
                >
                  xelilzadeelgun4@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:bagirzadturkan7@gmail.com"
                  className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400 break-all"
                >
                  bagirzadturkan7@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">
              Links
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/EugeneKhalilzade"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-3 transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5"
              >
                <Github className="h-5 w-5 text-cyan-400/80 transition-colors group-hover:text-cyan-400" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-300 transition-colors group-hover:text-white truncate">
                    Elgun
                  </span>
                  <span className="text-xs text-purple-400/80 group-hover:text-purple-300 transition-colors truncate">
                    @EugeneKhalilzade
                  </span>
                </div>
              </a>

              <a
                href="https://github.com/Prenses123"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-3 transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5"
              >
                <Github className="h-5 w-5 text-cyan-400/80 transition-colors group-hover:text-cyan-400" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-300 transition-colors group-hover:text-white truncate">
                    Turkan
                  </span>
                  <span className="text-xs text-purple-400/80 group-hover:text-purple-300 transition-colors truncate">
                    @Prenses123
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cyan-500/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CareerAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
