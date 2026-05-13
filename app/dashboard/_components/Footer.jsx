import Link from "next/link";
import React from "react";
import BrandLogo from "@/components/BrandLogo";

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white/70 py-8 backdrop-blur">
      <div className="page-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <BrandLogo className="w-fit" />
          <p className="mt-2 text-sm text-slate-600">
            Practice smarter, interview better.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
          <Link className="hover:text-primary" href="/dashboard">
            Dashboard
          </Link>
          <a className="hover:text-primary" href="mailto:xelilzadeelgun4@gmail.com">
            Contact
          </a>
          <a
            className="hover:text-primary"
            href="https://github.com/EugeneKhalilzade"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KaryerAI. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
