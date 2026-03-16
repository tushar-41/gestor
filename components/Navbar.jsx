"use client";
import Link from "next/link";
import { useState } from "react";
import NavItems from "./NavItems";
import CTAButton from "./CTA";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
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
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavItems />
          <CTAButton href="/signup" size="sm">
            Get Started
          </CTAButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span
              className={`block h-px bg-current transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-px bg-current transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4">
          <NavItems mobile />
          <CTAButton href="/signup" size="sm">
            Get Started
          </CTAButton>
        </div>
      )}
    </nav>
  );
}
