import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import UpgradeBanner from "@/components/UpgradeBanner";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <UpgradeBanner />
      <main className="page-shell flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
