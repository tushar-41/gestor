"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";

const Signup = () => {
  const [form, setForm] = useState({ name: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passType, setPassType] = useState(true);
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  function handleForm(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(
        "https://devpathtracker-prod.up.railway.app/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.name,
            password: form.password,
          }),
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const result = await response.json();
      setIsLoading(false);
      setForm({ name: "", password: "" });
      toast.success("Welcome to Gestor — please log in, " + result.username);
      router.replace("/login");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <div
      className="min-h-screen bg-white flex"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Left panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
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
            <span className="text-[15px] font-semibold text-slate-900">
              gestor
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[11px] font-medium text-blue-600 tracking-wide">
                Free forever
              </span>
            </div>
            <h1
              className="text-[28px] font-semibold text-slate-900 tracking-tight leading-tight mb-1.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Start your learning journey
            </h1>
            <p className="text-[14px] text-slate-400 font-light">
              Master skills, track progress, and accelerate your growth.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="name"
                placeholder="Choose a username"
                value={form.name}
                onChange={handleForm}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={passType ? "password" : "text"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleForm}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all pr-16"
                />
                <button
                  type="button"
                  onClick={() => setPassType((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-blue-500 hover:text-blue-700 transition-colors"
                >
                  {passType ? "Show" : "Hide"}
                </button>
              </div>
            </div>

            {/* Terms note */}
            <p className="text-[12px] text-slate-400 font-light leading-relaxed">
              By creating an account you agree to our{" "}
              <span className="text-slate-600 underline underline-offset-2 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-slate-600 underline underline-offset-2 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all shadow-sm hover:shadow-blue-200 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-[13px] text-slate-400 font-light mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right panel — branding ── */}
      <div className="hidden lg:flex w-[45%] bg-slate-50 border-l border-slate-100 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Blue glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
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
          <span className="text-[16px] font-semibold text-slate-900 tracking-tight">
            gestor
          </span>
        </div>

        {/* Feature highlights */}
        <div className="relative space-y-5">
          <p
            className="text-[30px] font-semibold text-slate-900 leading-tight tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Organize learning.
            <br />
            Master skills.
          </p>
          {[
            {
              icon: "📚",
              title: "Track Topics",
              desc: "Organize your learning into structured topics and categories.",
            },
            {
              icon: "⭐",
              title: "Monitor Skills",
              desc: "Watch your skills evolve from beginner to expert level.",
            },
            {
              icon: "📈",
              title: "Visualize Progress",
              desc: "See your growth with streaks, analytics, and insights.",
            },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[18px] mt-0.5">{f.icon}</span>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  {f.title}
                </p>
                <p className="text-[12px] text-slate-400 font-light">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof numbers */}
        <div className="relative flex gap-8">
          {[
            { value: "5k+", label: "Active learners" },
            { value: "50k+", label: "Topics tracked" },
            { value: "100k+", label: "Skills mastered" },
          ].map((s, i) => (
            <div key={i}>
              <p
                className="text-[22px] font-bold text-slate-900 leading-none mb-0.5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {s.value}
              </p>
              <p className="text-[11px] text-slate-400 font-light">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
