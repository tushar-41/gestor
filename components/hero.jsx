import CTAButton from "./CTA";

export default function Hero() {
  return (
    <section className="pt-36 pb-28 px-6 relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft blue glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[12px] text-blue-600 font-medium tracking-wide uppercase">
              Note management, reimagined
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[52px] md:text-[68px] font-semibold text-slate-900 leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Capture ideas.
            <br />
            <span className="text-blue-600">Track everything.</span>
          </h1>

          {/* Subheading */}
          <p className="text-[17px] text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto font-light">
            Gestor helps you write, organize, and track your notes and tasks —
            with the clarity you need to stay on top of what matters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <CTAButton href="/signup" size="lg">
              Get Started — it&apos;s free
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="opacity-80"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CTAButton>
            <CTAButton href="/login" size="lg" variant="outline">
              Log in
            </CTAButton>
          </div>

          {/* Social proof / subtle note */}
          <p className="mt-8 text-[13px] text-slate-400 font-light">
            No credit card required &nbsp;·&nbsp; Free forever plan
          </p>
        </div>

        {/* Hero visual / mock UI */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
            {/* Window chrome */}
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white border border-slate-200 rounded-md px-12 py-1">
                  <span className="text-[11px] text-slate-400">
                    gestor.app/notes
                  </span>
                </div>
              </div>
            </div>

            {/* App preview */}
            <div className="flex h-72">
              {/* Sidebar */}
              <div className="w-52 border-r border-slate-100 p-4 bg-slate-50/50 flex flex-col gap-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-2">
                  Workspace
                </p>
                {["📋 All Notes", "✅ Tasks", "📌 Pinned", "🗂 Archive"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className={`text-[12px] px-2 py-1.5 rounded-md cursor-pointer ${
                        i === 0
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>

              {/* Note list */}
              <div className="flex-1 p-4 flex flex-col gap-2 overflow-hidden">
                {[
                  { title: "Q4 Planning Notes", tag: "Work", time: "2m ago" },
                  {
                    title: "Book recommendations",
                    tag: "Personal",
                    time: "1h ago",
                  },
                  {
                    title: "Sprint retrospective",
                    tag: "Work",
                    time: "Yesterday",
                  },
                  { title: "Weekly review", tag: "Habit", time: "2d ago" },
                ].map((note, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                      i === 0
                        ? "border-blue-200 bg-blue-50/60"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-[12px] font-medium ${i === 0 ? "text-blue-800" : "text-slate-700"}`}
                      >
                        {note.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {note.time}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        note.tag === "Work"
                          ? "bg-blue-100 text-blue-600"
                          : note.tag === "Habit"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {note.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
