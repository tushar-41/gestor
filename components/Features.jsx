"use client";
import { useState } from "react";

const ALL_FEATURES = [
  {
    id: 1,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 6h12M4 10h8M4 14h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Rich Note Editor",
    description:
      "Write with a clean, distraction-free editor. Format text, add checklists, and embed links — all without leaving your flow.",
  },
  {
    id: 2,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="3"
          width="6"
          height="6"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="3"
          width="6"
          height="6"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="11"
          width="6"
          height="6"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="11"
          width="6"
          height="6"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    title: "Task Tracking",
    description:
      "Turn notes into actionable tasks with due dates and status tracking. Never lose sight of what needs to be done.",
  },
  {
    id: 3,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3v14M3 10h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Smart Organization",
    description:
      "Tag, pin, and categorize your notes effortlessly. Find anything instantly with powerful full-text search.",
  },
  {
    id: 4,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 9l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Progress Insights",
    description:
      "Visualize your productivity at a glance. Weekly summaries and streaks keep you motivated and on track.",
  },
  {
    id: 5,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 6v4l3 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Version History",
    description:
      "Every edit is saved. Review past versions of any note and restore with one click — no work ever lost.",
  },
  {
    id: 6,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 4l5.5 5.5M16 4l-5.5 5.5M4 16l5.5-5.5M16 16l-5.5-5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Cross-device Sync",
    description:
      "Access your notes anywhere. Changes sync instantly across all your devices, always up to date.",
  },
];

function FeatureCard({ feature }) {
  return (
    <div className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
        {feature.icon}
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900 mb-2">
        {feature.title}
      </h3>
      <p className="text-[14px] text-slate-500 leading-relaxed font-light">
        {feature.description}
      </p>
    </div>
  );
}

const COUNT_OPTIONS = [3, 4, 6];

export default function FeaturesSection() {
  const [count, setCount] = useState(6);

  const visible = ALL_FEATURES.slice(0, count);

  return (
    <section id="features" className="py-28 px-6 bg-slate-50/60">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-[12px] font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Features
          </p>
          <h2
            className="text-[38px] font-semibold text-slate-900 leading-tight tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Everything you need to stay organized
          </h2>
          <p className="text-[15px] text-slate-500 font-light leading-relaxed">
            Gestor combines note-taking with task management into one seamless
            workspace.
          </p>
        </div>

        {/* Feature count selector */}
        <div className="flex items-center gap-2 mb-10">
          <span className="text-[13px] text-slate-400 mr-1">Show</span>
          {COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                count === n
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {n} features
            </button>
          ))}
        </div>

        {/* Feature grid */}
        <div
          className={`grid gap-4 ${count === 3 ? "grid-cols-1 md:grid-cols-3" : count === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}`}
        >
          {visible.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
