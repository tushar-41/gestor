const ALL_FEATURES = [
  {
    id: 1,
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
    title: "Organize Topics",
    description:
      "Create and manage learning topics with a hierarchical structure. Categorize your knowledge domains and track progress across all areas.",
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
    title: "Track Skill Evolution",
    description:
      "Monitor your skill progression from manual to automated. Measure complexity, track automation levels, and understand your growth journey.",
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
    title: "Smart Code Notes",
    description:
      "Save and organize code snippets with syntax highlighting. Tag, search, and categorize by language for quick reference.",
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
    title: "Project Management",
    description:
      "Create and manage learning projects. Link topics, track status, and monitor your project progress with connected learning paths.",
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
    title: "Spaced Repetition",
    description:
      "Automatically track when skills are at risk of regression. Get reminders to review and maintain your hard-earned knowledge.",
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
    title: "Learning Analytics",
    description:
      "Visualize your progress with streaks, charts, and insights. Understand your learning velocity and stay motivated with real-time stats.",
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

export default function FeaturesSection() {
  const visible = ALL_FEATURES;

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
            Everything for accelerated learning
          </h2>
          <p className="text-[15px] text-slate-500 font-light leading-relaxed">
            Gestor combines topic tracking, skill evolution, project management,
            and spaced repetition into one comprehensive learning platform.
          </p>
        </div>

        {/* Feature grid */}
        <div className={"grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}>
          {visible.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
