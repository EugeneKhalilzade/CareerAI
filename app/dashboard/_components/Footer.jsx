import Link from "next/link";
import React from "react";
import BrandLogo from "@/components/BrandLogo";

function Footer() {
  return (
    <footer className="mt-10 border-t border-[#d4af37]/15 bg-[#071109]/90 py-8 backdrop-blur-xl">
      <div className="page-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <BrandLogo className="w-fit" />
          <p className="mt-2 text-sm text-[#b6a66d]">
            Practice smarter, interview better.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-[#b6a66d]">
          <Link className="transition-colors hover:text-[#d4af37]" href="/dashboard">
            Dashboard
          </Link>
          <a className="transition-colors hover:text-[#d4af37]" href="mailto:xelilzadeelgun4@gmail.com">
            Contact
          </a>
          <a
            className="transition-colors hover:text-[#d4af37]"
            href="https://github.com/EugeneKhalilzade"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-[#a08c4a]/70">
            © {new Date().getFullYear()} CareerAI. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
