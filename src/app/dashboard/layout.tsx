"use client";

import { useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { cn } from "@/lib/utils";

const SidebarContext = createContext({ collapsed: false, setCollapsed: (v: boolean) => {} });
export const useSidebar = () => useContext(SidebarContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-[#020617] noise-bg relative">
        {/* Ambient glow backgrounds */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-600/[0.03] rounded-full blur-[100px]" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600/[0.02] rounded-full blur-[80px]" />
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-blue-600/[0.02] rounded-full blur-[80px]" />
        </div>

        <Sidebar />
        <div
          className={cn(
            "transition-all duration-300 ease-in-out relative z-10",
            collapsed ? "ml-[68px]" : "ml-[260px]"
          )}
        >
          <Topbar />
          <main className="p-4 md:p-6 min-h-[calc(100vh-64px)]">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
