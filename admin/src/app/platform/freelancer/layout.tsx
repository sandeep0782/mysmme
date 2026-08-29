"use client";

import React, { useState, type ReactNode } from "react";

import FreelancerNavbar from "@/components/Freelancer/FreelancerNavbar";
import FreelancerSidebar from "@/components/Freelancer/FreelancerSidebar";

export default function FreelancerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* SIDEBAR */}
      <FreelancerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* NAVBAR */}
        <FreelancerNavbar toggleSidebar={toggleSidebar} />

        {/* CONTENT */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#f7f7f8]">
          {children}
        </main>
      </div>
    </div>
  );
}
