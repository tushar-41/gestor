import Link from "next/link";

const LINKS = {
  Product: ["Features", "How it works", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Contact", "Status", "Privacy"],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
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
              <span className="text-[15px] font-semibold text-slate-900 tracking-tight">
                gestor
              </span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px] font-light">
              Note management and tracking for focused people.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-light"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-400 font-light">
            © {new Date().getFullYear()} Gestor. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Twitter", "GitHub", "LinkedIn"].map((name) => (
              <Link
                key={name}
                href="#"
                className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
