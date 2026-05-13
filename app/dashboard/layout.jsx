import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="page-shell flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
