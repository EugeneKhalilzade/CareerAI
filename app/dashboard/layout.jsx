import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import UpgradeBanner from "@/components/UpgradeBanner";
import DarkShell from "@/components/DarkShell";

function DashboardLayout({ children }) {
  return (
    <DarkShell className="flex min-h-screen flex-col">
      <Header />
      <UpgradeBanner />
      <main className="page-shell flex-1 py-8">{children}</main>
      <Footer />
    </DarkShell>
  );
}

export default DashboardLayout;
