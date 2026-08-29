"use client";

import React, { useState, type ReactNode } from "react";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <div className="shrink-0">
          <AdminNavbar />
        </div>

        {/* ONLY THIS AREA SCROLLS */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
