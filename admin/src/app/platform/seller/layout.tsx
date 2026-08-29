"use client";

import SellerNavbar from "@/components/Seller/SellerNavbar";
import SellerSidebar from "@/components/Seller/SellerSidebar";
import React, { useState, type ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <SellerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <div className="shrink-0">
          <SellerNavbar />
        </div>

        {/* ONLY THIS AREA SCROLLS */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
