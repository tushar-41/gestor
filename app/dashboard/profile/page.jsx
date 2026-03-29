"use client";

import { useEffect, useState } from "react";
import { apiCall, logout } from "@/lib/auth";
import { toast } from "sonner";

function timeAgo(dateStr) {
  if (!dateStr) return "N/A";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function fmt(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const AVATAR_GRADIENTS = [["#60A5FA", "#2563EB"]];

function getGradient(name) {
  if (!name) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall("/current_user");
      if (response) {
        let userData = {};
        if (typeof response === "string") {
          const parts = response.split(" ");
          userData = { name: parts[0], username: parts[0], id: parts[1] };
        } else {
          userData = response;
        }
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 38,
              height: 38,
              border: "3px solid #e0e7ff",
              borderTop: "3px solid #6366f1",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <p className="text-sm text-slate-500">Loading profile...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.username || "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const [gradStart, gradEnd] = getGradient(displayName);

  return (
    <div
      className="w-full min-h-full flex flex-col items-center justify-start py-12 px-4"
      style={{ background: "#f8fafc" }}
    >
      {/* Page title */}
      <div className="w-full max-w-lg text-center mb-8">
        <h1
          className="text-[30px] font-semibold text-slate-900 tracking-tight mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My Profile
        </h1>
        <p className="text-[14px] text-slate-400 font-light">
          Your personal information and account details
        </p>
      </div>

      {/* Main card */}
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow:
            "0 4px 24px rgba(99,102,241,0.08), 0 0 0 1px rgba(99,102,241,0.07)",
        }}
      >
        {/* Gradient banner */}
        <div
          style={{
            height: 90,
            background: `linear-gradient(135deg, ${gradStart} 0%, ${gradEnd} 100%)`,
            position: "relative",
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Avatar — overlaps banner */}
        <div className="flex flex-col items-center" style={{ marginTop: -44 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
              border: "4px solid #fff",
              boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
              letterSpacing: "-1px",
              zIndex: 20,
            }}
          >
            {initials}
          </div>

          {/* Name + email */}
          <div className="text-center mt-3 mb-6 px-6">
            <h2
              className="text-[22px] font-bold text-slate-900 tracking-tight"
              style={{ letterSpacing: "-0.4px" }}
            >
              {displayName}
            </h2>
            {user?.email && (
              <p className="text-[13px] text-slate-400 mt-0.5">{user.email}</p>
            )}
            {/* Active badge */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "#ecfdf5",
                  color: "#059669",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#34d399",
                    display: "inline-block",
                  }}
                />
                Active Account
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f1f5f9", margin: "0 24px" }} />

        {/* Info rows */}
        <div className="px-6 py-5 space-y-1">
          <InfoRow
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            }
            label="Username"
            value={user?.username || user?.name || "—"}
          />
          <InfoRow
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="22,6 12,13 2,6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            }
            label="Email"
            value={user?.email || "Not provided"}
          />
          {user?.bio && (
            <InfoRow
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="14 2 14 8 20 8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
              label="Bio"
              value={user.bio}
            />
          )}
          <InfoRow
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            label="Member Since"
            value={fmt(user?.createdAt)}
            sub={timeAgo(user?.createdAt)}
          />
          {user?.id && (
            <InfoRow
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="12"
                    x2="12"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="10"
                    y1="14"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
              label="User ID"
              value={`#${user.id}`}
            />
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f1f5f9", margin: "0 24px" }} />

        {/* Logout button */}
        <div className="px-6 py-5">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all"
            style={{
              background: loggingOut ? "#fca5a5" : "#fef2f2",
              border: "1.5px solid #fecaca",
              color: loggingOut ? "#fff" : "#ef4444",
              cursor: loggingOut ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loggingOut) {
                e.currentTarget.style.background = "#fee2e2";
                e.currentTarget.style.borderColor = "#fca5a5";
              }
            }}
            onMouseLeave={(e) => {
              if (!loggingOut) {
                e.currentTarget.style.background = "#fef2f2";
                e.currentTarget.style.borderColor = "#fecaca";
              }
            }}
          >
            {loggingOut ? (
              <>
                <span
                  style={{
                    width: 15,
                    height: 15,
                    border: "2px solid rgba(239,68,68,0.3)",
                    borderTop: "2px solid #ef4444",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Signing out...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <polyline
                    points="16 17 21 12 16 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="21"
                    y1="12"
                    x2="9"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[12px] text-slate-400 mt-6 text-center">
        Account ID #{user?.id} · Data secured and private
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function InfoRow({ icon, label, value, sub }) {
  return (
    <div
      className="flex items-center justify-between py-3 px-3 rounded-xl transition-colors"
      style={{ gap: 12 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "#eef2ff",
            color: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      </div>
      <div className="text-right" style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#1e293b",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sub}</p>
        )}
      </div>
    </div>
  );
}
