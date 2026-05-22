"use client";
import Link from "next/link";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";

function Header() {
  const path = usePathname();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/calendar", label: "Calendar" },
    { href: "/dashboard/peer", label: "Live Peer Practice" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <BrandLogo href="/dashboard" showTagline />
          <nav className="hidden items-center gap-1 rounded-full border border-cyan-500/20 bg-white/[0.04] p-1 md:flex">
            {navItems.map((item) => {
              const active = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "text-slate-400 hover:text-cyan-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard#new-interview">
            <Button
              size="sm"
              className="hidden rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] border-0 md:inline-flex"
            >
              New Interview
            </Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}

export default Header;
