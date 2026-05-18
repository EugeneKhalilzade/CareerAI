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
    <header className="sticky top-0 z-20 border-b bg-white/85 backdrop-blur">
      <div className="page-shell flex h-20 items-center justify-between">
        <BrandLogo href="/dashboard" showTagline />
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                path === item.href ? "text-primary" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard#new-interview">
            <Button size="sm" className="hidden rounded-full md:inline-flex">
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
