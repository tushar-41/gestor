"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import { getToken } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check authentication and initialize sidebar state
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // On mobile, close sidebar by default
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    setIsLoading(false);

    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Top Navbar */}
      <DashboardNavbar
        onSearchOpen={() => setSearchOpen(true)}
        onMobileToggleSidebar={handleToggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
