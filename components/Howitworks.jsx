const STEPS = [
  {
    number: "01",
    title: "Create topics",
    description:
      "Sign up and start organizing your learning. Create topics for different skill domains or subjects you want to master.",
  },
  {
    number: "02",
    title: "Save code & notes",
    description:
      "Save code snippets, notes, and resources for each topic. Tag by language and organize for quick reference and learning.",
  },
  {
    number: "03",
    title: "Track skill evolution",
    description:
      "Monitor how your skills evolve. Track automation levels, complexity, and progression as you move from learning to mastery.",
  },
  {
    number: "04",
    title: "Review & improve",
    description:
      "Get spaced repetition reminders for skills at risk. Use analytics to visualize progress and maintain momentum in your learning journey.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-20">
          <p className="text-[12px] font-semibold text-blue-500 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2
            className="text-[38px] font-semibold text-slate-900 leading-tight tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Master your learning journey
          </h2>
          <p className="text-[15px] text-slate-500 font-light leading-relaxed">
            A simple four-step flow to organize, track, and accelerate your
            learning with spaced repetition and analytics.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {/* Step number bubble */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-blue-100 flex items-center justify-center mb-6 shadow-sm">
                  <span
                    className="text-[22px] font-bold text-blue-600"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 className="text-[16px] font-semibold text-slate-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[14px] text-slate-500 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-[24px] font-semibold text-white leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ready to accelerate your learning?
            </h3>
            <p className="text-blue-200 text-[14px] font-light">
              Join thousands of developers mastering new skills with Gestor.
            </p>
          </div>
          <a
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-blue-600 font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
          >
            Start for free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
