"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout, apiCall } from "@/lib/auth";

export default function DashboardSidebar({ isOpen, onToggle, isMobile }) {
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
        const userInfo =
          typeof response === "string"
            ? response.split(" ")[0]
            : response.username;
        setUser({ name: userInfo });
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      setUser({ name: "User" });
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  const menuItems = [
    {
      label: "Home",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 10L10 3l7 7v7a1 1 0 01-1 1h-4v-5h-4v5H4a1 1 0 01-1-1v-7z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      href: "/dashboard",
    },
    {
      label: "Topics",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      href: "/dashboard/topics",
    },
    {
      label: "Notes",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 7h8M6 10h8M6 13h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      href: "/dashboard/notes",
    },
    {
      label: "Projects",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6H3V4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 6H17V15C17 15.5523 16.5523 16 16 16H4C3.44772 16 3 15.5523 3 15V6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 3V2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 3V2C12 1.44772 12.4477 1 13 1C13.5523 1 14 1.44772 14 2V3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      href: "/dashboard/projects",
    },
    {
      label: "Reviews",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 10Q10 3 17 10Q10 17 3 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        </svg>
      ),
      href: "/dashboard/reviews",
    },
    {
      label: "Skills",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <g fill="currentColor">
            <circle cx="10" cy="10" r="2.2" />
            <circle cx="10" cy="5.5" r="1.8" />
            <circle cx="10" cy="14.5" r="1.8" />
            <circle cx="5.5" cy="10" r="1.8" />
            <circle cx="14.5" cy="10" r="1.8" />
            <circle cx="6.8" cy="6.8" r="1.8" />
            <circle cx="13.2" cy="6.8" r="1.8" />
            <circle cx="6.8" cy="13.2" r="1.8" />
            <circle cx="13.2" cy="13.2" r="1.8" />
          </g>
        </svg>
      ),
      href: "/dashboard/skills",
      disabled: true,
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex bg-white border-r border-slate-200 flex-col h-screen sticky top-16 transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Sidebar Header with Toggle */}
        <div
          className={`border-b border-slate-200 relative flex items-center ${isOpen ? "p-6 justify-between" : "flex-col gap-2 p-3"}`}
        >
          {isOpen && (
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-blue-600"
              >
                <rect
                  x="2"
                  y="2"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="11"
                  y="2"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="2"
                  y="11"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="11"
                  y="11"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-[14px] font-semibold text-slate-900 tracking-tight">
                Dashboard
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            title="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M2 4h16M2 10h16M2 16h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Expanded Navigation */}
        {isOpen && (
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    title="Coming soon"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium cursor-not-allowed select-none opacity-35"
                  >
                    <span className="text-slate-400">{item.icon}</span>
                    <span className="text-slate-500">{item.label}</span>
                    <span className="ml-auto text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md tracking-wide">
                      Soon
                    </span>
                  </div>
                );
              }
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
                  <span
                    className={
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-blue-600"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Collapsed Navigation — icon only */}
        {!isOpen && (
          <nav className="flex-1 px-3 py-6 space-y-3 overflow-y-auto flex flex-col items-center">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    title="Coming soon"
                    className="flex items-center justify-center w-10 h-10 rounded-lg cursor-not-allowed select-none opacity-35 text-slate-400"
                  >
                    {item.icon}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Footer */}
        <div
          className={`p-4 border-t border-slate-200 ${isOpen ? "space-y-2" : "flex justify-center"}`}
        >
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isOpen ? "w-full px-4 py-3" : "w-10 h-10 justify-center"
            }`}
            title="Logout"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 6l4 4m0 0l-4 4m4-4H7m0 0a4 4 0 01-4-4V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isOpen && (isLoggingOut ? "Logging out..." : "Logout")}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onToggle}
          />
          <aside className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white border-r border-slate-200 flex flex-col z-50 overflow-y-auto">
            {/* Logo Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="5"
                      height="5"
                      rx="1"
                      fill="white"
                    />
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
                <span className="text-[14px] font-semibold text-slate-900 tracking-tight">
                  gestor
                </span>
              </Link>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5l10 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                if (item.disabled) {
                  return (
                    <div
                      key={item.href}
                      title="Coming soon"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium cursor-not-allowed select-none opacity-35"
                    >
                      <span className="text-slate-400">{item.icon}</span>
                      <span className="text-slate-500">{item.label}</span>
                      <span className="ml-auto text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md tracking-wide">
                        Soon
                      </span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobile && onToggle()}
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
          </aside>
        </>
      )}
    </>
  );
}
