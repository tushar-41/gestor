"use client";
import { useState } from "react";

// ─── Icons (inline SVG to avoid dependencies) ───────────────────────────────
const Icon = ({ d, size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  topics:
    "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  notes:
    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  reviews: "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2",
  skills: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  projects:
    "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  path: "M3 12h18 M3 6h18 M3 18h18",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  streak: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z",
  plus: "M12 5v14 M5 12h14",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  risk: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  check: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockStats = {
  totalTopics: 24,
  totalNotes: 187,
  streak: 12,
  reviewsDue: 8,
  projectsActive: 5,
  skillFamilies: 6,
  atRiskTopics: 3,
  learningScore: 78,
};

const mockTopics = [
  { id: 1, name: "React Hooks", notes: 14, status: "active", tag: "Frontend" },
  {
    id: 2,
    name: "System Design",
    notes: 22,
    status: "review",
    tag: "Architecture",
  },
  { id: 3, name: "Graph Algorithms", notes: 9, status: "at-risk", tag: "DSA" },
  { id: 4, name: "Docker & K8s", notes: 17, status: "active", tag: "DevOps" },
  {
    id: 5,
    name: "SQL Optimization",
    notes: 11,
    status: "review",
    tag: "Database",
  },
];

const mockReviews = [
  { topic: "React Hooks", due: "Today", confidence: 85 },
  { topic: "Binary Trees", due: "Today", confidence: 42 },
  { topic: "CSS Grid", due: "Tomorrow", confidence: 91 },
  { topic: "REST APIs", due: "Tomorrow", confidence: 67 },
  { topic: "TypeScript", due: "In 2 days", confidence: 55 },
];

const mockProjects = [
  { name: "E-Commerce API", topics: 4, progress: 68, color: "bg-sky-500" },
  { name: "ML Pipeline", topics: 7, progress: 35, color: "bg-emerald-500" },
  { name: "Portfolio Site", topics: 3, progress: 90, color: "bg-amber-500" },
  { name: "Auth Service", topics: 2, progress: 52, color: "bg-rose-500" },
];

const mockSkills = [
  { name: "Manual Coding", level: 4, max: 5, family: "Engineering" },
  { name: "Code Review", level: 3, max: 5, family: "Engineering" },
  { name: "CI/CD", level: 2, max: 5, family: "DevOps" },
  { name: "Automation", level: 3, max: 5, family: "DevOps" },
];

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { key: "topics", label: "Topics", icon: Icons.topics },
  { key: "notes", label: "Notes", icon: Icons.notes },
  { key: "reviews", label: "Reviews", icon: Icons.reviews, badge: 8 },
  { key: "skills", label: "Skill Evolution", icon: Icons.skills },
  { key: "projects", label: "Projects", icon: Icons.projects },
  { key: "path", label: "Learning Path", icon: Icons.path },
  { key: "search", label: "Search", icon: Icons.search },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, icon, accent, delay }) => (
  <div
    className="relative bg-stone-900 border border-stone-800 rounded-2xl p-5 overflow-hidden group hover:border-stone-600 transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className={`absolute top-0 left-0 w-1 h-full ${accent} rounded-l-2xl`}
    />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-stone-500 text-xs font-semibold tracking-widest uppercase mb-1">
          {label}
        </p>
        <p className="text-4xl font-black text-stone-100 leading-none">
          {value}
        </p>
        {sub && <p className="text-stone-500 text-xs mt-1.5">{sub}</p>}
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${accent} bg-opacity-10 flex items-center justify-center text-stone-300`}
      >
        <Icon d={icon} size={18} />
      </div>
    </div>
    <div
      className={`absolute bottom-0 right-0 w-24 h-24 rounded-full ${accent} opacity-5 translate-x-8 translate-y-8`}
    />
  </div>
);

const TopicRow = ({ topic }) => {
  const statusStyle = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "at-risk": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-800 last:border-0 group hover:bg-stone-800/40 px-3 -mx-3 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400">
          <Icon d={Icons.topics} size={14} />
        </div>
        <div>
          <p className="text-stone-200 text-sm font-semibold">{topic.name}</p>
          <p className="text-stone-500 text-xs">
            {topic.notes} notes · {topic.tag}
          </p>
        </div>
      </div>
      <span
        className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusStyle[topic.status]}`}
      >
        {topic.status}
      </span>
    </div>
  );
};

const ReviewRow = ({ review }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-stone-800 last:border-0">
    <div>
      <p className="text-stone-200 text-sm font-medium">{review.topic}</p>
      <p className="text-stone-500 text-xs">{review.due}</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-stone-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${review.confidence >= 80 ? "bg-emerald-500" : review.confidence >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
          style={{ width: `${review.confidence}%` }}
        />
      </div>
      <span className="text-xs text-stone-400 w-8 text-right">
        {review.confidence}%
      </span>
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="bg-stone-800/60 rounded-xl p-4 hover:bg-stone-800 transition-colors cursor-pointer">
    <div className="flex items-center gap-2.5 mb-3">
      <div className={`w-2.5 h-2.5 rounded-full ${project.color}`} />
      <p className="text-stone-200 text-sm font-semibold truncate">
        {project.name}
      </p>
    </div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-stone-500 text-xs">
        {project.topics} topics linked
      </span>
      <span className="text-stone-400 text-xs font-bold">
        {project.progress}%
      </span>
    </div>
    <div className="w-full h-1.5 bg-stone-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${project.color} transition-all duration-500`}
        style={{ width: `${project.progress}%` }}
      />
    </div>
  </div>
);

const SkillBar = ({ skill }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1.5">
      <div>
        <span className="text-stone-300 text-sm font-medium">{skill.name}</span>
        <span className="text-stone-600 text-xs ml-2">{skill.family}</span>
      </div>
      <span className="text-stone-400 text-xs">
        {skill.level}/{skill.max}
      </span>
    </div>
    <div className="flex gap-1">
      {Array.from({ length: skill.max }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-2 rounded-full ${i < skill.level ? "bg-violet-500" : "bg-stone-700"}`}
        />
      ))}
    </div>
  </div>
);

// ─── Section Headers ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-stone-200 font-bold text-base tracking-tight">
      {title}
    </h2>
    {action && (
      <button className="text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1 transition-colors">
        {action} <Icon d={Icons.arrow} size={12} />
      </button>
    )}
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden"
      style={{ fontFamily: "'Syne', 'Segoe UI', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-stone-800 gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Icon d={Icons.streak} size={16} className="text-white" />
          </div>
          <span
            className={`font-black text-lg tracking-tight text-stone-100 transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"} whitespace-nowrap`}
          >
            LearnOS
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`relative flex items-center gap-3 w-full px-4 py-2.5 transition-all duration-200 border-l-2
                ${
                  activeNav === item.key
                    ? "bg-violet-500/10 border-violet-500 text-violet-300"
                    : "border-transparent text-stone-500 hover:text-stone-300 hover:bg-stone-800/50"
                }`}
            >
              <Icon d={item.icon} size={17} className="flex-shrink-0" />
              <span
                className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
              >
                {item.label}
              </span>
              {item.badge && sidebarOpen && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.badge && !sidebarOpen && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-stone-800 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0">
            JD
          </div>
          <div
            className={`transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"} overflow-hidden`}
          >
            <p className="text-stone-200 text-xs font-bold whitespace-nowrap">
              John Doe
            </p>
            <p className="text-stone-500 text-xs whitespace-nowrap">
              john@dev.io
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-stone-900 border-b border-stone-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="flex flex-col gap-1.5 cursor-pointer p-1"
            >
              <span className="block w-5 h-0.5 bg-stone-400 rounded transition-all" />
              <span
                className={`block h-0.5 bg-stone-400 rounded transition-all ${sidebarOpen ? "w-3.5" : "w-5"}`}
              />
              <span className="block w-5 h-0.5 bg-stone-400 rounded transition-all" />
            </button>
            <div className="relative">
              <Icon
                d={Icons.search}
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
              />
              <input
                type="text"
                placeholder="Search topics, notes, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-4 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-violet-500 w-72 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5">
              <Icon d={Icons.streak} size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold">
                {mockStats.streak} day streak
              </span>
            </div>
            <button className="relative w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors">
              <Icon d={Icons.bell} size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors">
              <Icon d={Icons.user} size={17} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-stone-950">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-stone-100">
                Dashboard
              </h1>
              <p className="text-stone-500 text-sm mt-0.5">
                Your learning overview — Wednesday, March 4
              </p>
            </div>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
              <Icon d={Icons.plus} size={15} />
              New Topic
            </button>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Topics"
              value={mockStats.totalTopics}
              sub="3 at risk"
              icon={Icons.topics}
              accent="bg-violet-500"
              delay={0}
            />
            <StatCard
              label="Notes"
              value={mockStats.totalNotes}
              sub="Across all topics"
              icon={Icons.notes}
              accent="bg-sky-500"
              delay={50}
            />
            <StatCard
              label="Due Reviews"
              value={mockStats.reviewsDue}
              sub="Review now"
              icon={Icons.reviews}
              accent="bg-rose-500"
              delay={100}
            />
            <StatCard
              label="Active Projects"
              value={mockStats.projectsActive}
              sub={`${mockStats.skillFamilies} skill families`}
              icon={Icons.projects}
              accent="bg-emerald-500"
              delay={150}
            />
          </div>

          {/* ── Row 2: Topics + Reviews ── */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            {/* Topics */}
            <div className="col-span-3 bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <SectionHeader title="Recent Topics" action="View all" />
              {mockTopics.map((t) => (
                <TopicRow key={t.id} topic={t} />
              ))}
            </div>

            {/* Reviews */}
            <div className="col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <SectionHeader title="Reviews Due" action="Start session" />
              {mockReviews.map((r, i) => (
                <ReviewRow key={i} review={r} />
              ))}
              <button className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Icon d={Icons.check} size={15} /> Start Review Session
              </button>
            </div>
          </div>

          {/* ── Row 3: Projects + Skills + Learning Path ── */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Projects */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <SectionHeader title="Projects" action="View all" />
              <div className="space-y-2.5">
                {mockProjects.map((p, i) => (
                  <ProjectCard key={i} project={p} />
                ))}
              </div>
            </div>

            {/* Skill Evolution */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <SectionHeader title="Skill Evolution" action="View all" />
              {mockSkills.map((s, i) => (
                <SkillBar key={i} skill={s} />
              ))}
              <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-stone-500 text-xs">
                  Regression risk check
                </span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <Icon d={Icons.check} size={12} /> No risk detected
                </span>
              </div>
            </div>

            {/* Learning Path + At Risk */}
            <div className="flex flex-col gap-4">
              {/* Learning Path */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex-1">
                <SectionHeader title="Learning Path" action="View journey" />
                <div className="flex items-center justify-center flex-col gap-2 py-4">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#292524"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="3"
                        strokeDasharray={`${mockStats.learningScore} ${100 - mockStats.learningScore}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-black text-stone-100">
                        {mockStats.learningScore}
                      </span>
                      <span className="text-[9px] text-stone-500 uppercase tracking-widest">
                        score
                      </span>
                    </div>
                  </div>
                  <p className="text-stone-400 text-xs text-center">
                    You're progressing well.
                    <br />
                    Keep the streak going!
                  </p>
                </div>
              </div>

              {/* At Risk Topics */}
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                <SectionHeader title="⚠ At-Risk Topics" />
                <div className="space-y-2">
                  {["Graph Algorithms", "Recursion", "OS Concepts"].map(
                    (t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span className="text-stone-300 text-xs">{t}</span>
                        <button className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full hover:bg-rose-500/30 transition-colors">
                          Review
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 4: Search Bar (Global Search module) ── */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <SectionHeader title="Global Search" />
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Icon
                  d={Icons.search}
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                />
                <input
                  type="text"
                  placeholder="Search across topics, notes, projects, skills..."
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-11 pr-4 py-3 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <button className="bg-violet-600 hover:bg-violet-500 text-white px-5 rounded-xl font-bold text-sm transition-colors">
                Search
              </button>
              <div className="flex gap-2">
                {["Topics", "Notes", "Projects"].map((tag) => (
                  <button
                    key={tag}
                    className="bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs px-3 rounded-xl transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
