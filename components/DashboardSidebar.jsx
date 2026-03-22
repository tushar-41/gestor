"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout, apiCall } from "@/lib/auth";

export default function DashboardSidebar({ isOpen, onToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await apiCall("/current_user");
      if (response) {
        // The response is plain text like "test11 2" (username id)
        // Parse it to extract username
        const userInfo = typeof response === 'string' ? response.split(' ')[0] : response.username;
        setUser({ name: userInfo });
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      setUser({ name: "User" });
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout();
  };

  const menuItems = [
    {
      label: "Home",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1h-4v-5h-4v5H4a1 1 0 01-1-1v-7z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      href: "/dashboard",
    },
    {
      label: "Topics",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      href: "/dashboard/topics",
    },
    {
      label: "Learning Path",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      href: "/dashboard/learning-path",
    },
    {
      label: "Notes",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      href: "/dashboard/notes",
    },
    {
      label: "Projects",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      href: "/dashboard/projects",
    },
    {
      label: "Reviews",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10.5 1.5L13 6h5l-4 3 1.5 4.5L10 11l-4 2.5 1.5-4.5-4-3h5l2.5-4.5z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      href: "/dashboard/reviews",
    },
    {
      label: "Skills",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1L13 7H19L14.5 11L16.5 17L10 13L3.5 17L5.5 11L1 7H7L10 1Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      href: "/dashboard/skills",
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-16">
        {/* Dashboard Heading */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-600">
              <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-[14px] font-semibold text-slate-900 tracking-tight">
              Dashboard
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className={active ? "text-white" : "text-slate-400 group-hover:text-blue-600"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 6l4 4m0 0l-4 4m4-4H7m0 0a4 4 0 01-4-4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onToggle}
          />

          {/* Mobile Sidebar Content */}
          <aside className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white border-r border-slate-200 flex flex-col z-50 overflow-y-auto">
            {/* Logo Header with Close Button */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                    <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                    <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                    <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
                  </svg>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 tracking-tight">gestor</span>
              </Link>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onToggle}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span className={active ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 space-y-2">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 6l4 4m0 0l-4 4m4-4H7m0 0a4 4 0 01-4-4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
