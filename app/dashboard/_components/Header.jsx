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
    <header className="sticky top-0 z-20 border-b border-[#d4af37]/15 bg-[#071109]/80 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <BrandLogo href="/dashboard" showTagline />
          <nav className="hidden items-center gap-1 rounded-full border border-[#d4af37]/10 bg-white/[0.04] p-1 md:flex">
            {navItems.map((item) => {
              const active = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#0d2a18] text-white shadow-[0_0_20px_rgba(212,175,55,0.12)]"
                      : "text-[#b6a66d] hover:text-[#f3d76b]"
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
              className="hidden rounded-full bg-[#d4af37] text-[#06180d] hover:bg-[#f3d76b] md:inline-flex"
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
