"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiCall } from "@/lib/auth";

export default function DashboardNavbar({ onSearchOpen, onMobileToggleSidebar, isMobile }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSearchOpen]);

  const fetchUserInfo = async () => {
    try {
      const response = await apiCall("/current_user");
      if (response) {
        // The response is plain text like "test11 2" (username id)
        // Parse it to extract username
        const userInfo =
          typeof response === "string"
            ? response.split(" ")[0]
            : response.username;
        setUser({ name: userInfo });
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      setUser({ name: "Profile" });
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Hide navbar on auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left Side - Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={onMobileToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 lg:hidden"
            title="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 4h16M2 10h16M2 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect
                x="8"
                y="1"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.6"
              />
              <rect
                x="1"
                y="8"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.6"
              />
              <rect
                x="8"
                y="8"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.3"
              />
            </svg>
          </div>
          <span className="text-[14px] font-semibold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors hidden md:inline">
            gestor
          </span>
        </Link>
      </div>

      {/* Center - Search Button */}
      <button
        onClick={onSearchOpen}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all group flex-1 max-w-md mx-auto"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          className="text-slate-400 group-hover:text-slate-500"
        >
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M14 14l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[14px] text-slate-500 group-hover:text-slate-600 flex-1 text-left">
          Search...
        </span>
        <kbd className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-medium text-slate-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Right Side - User Profile */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/profile"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
            pathname === "/dashboard/profile"
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
          }`}
          title="Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
            {isLoadingUser ? "U" : user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="hidden md:inline text-[13px] font-medium truncate max-w-[150px]">
            {isLoadingUser ? "Loading..." : user?.name || "Profile"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
