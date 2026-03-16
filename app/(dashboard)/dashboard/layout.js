"use client";
export default function Dashboard({ children }) {
  return (
    <div
      className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </div>
  );
}
