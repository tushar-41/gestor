"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passType, setPassType] = useState(true);

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
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
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
      localStorage.setItem("token", result.token);
      setIsLoading(false);
      setForm({ name: "", password: "" });
      toast.success("Welcome to Gestor");
      // Redirect to dashboard after successful login
      router.push("/dashboard");
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
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex w-[45%] bg-slate-50 border-r border-slate-100 flex-col justify-between p-12 relative overflow-hidden">
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
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

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

        {/* Quote / value prop */}
        <div className="relative">
          <p
            className="text-[32px] font-semibold text-slate-900 leading-tight tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Master your skills.
            <br />
            Track your progress.
          </p>
          <p className="text-[14px] text-slate-500 font-light leading-relaxed max-w-xs">
            Organize topics, manage projects, track skill evolution, and
            accelerate your learning journey with spaced repetition.
          </p>
        </div>

        {/* Fake testimonial */}
      </div>

      {/* ── Right panel — form ── */}
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
            <h1
              className="text-[28px] font-semibold text-slate-900 tracking-tight leading-tight mb-1.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome back
            </h1>
            <p className="text-[14px] text-slate-400 font-light">
              Continue learning and mastering your skills.
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
                placeholder="Enter your username"
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
                  placeholder="Enter your password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all shadow-sm hover:shadow-blue-200 hover:shadow-md active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-[13px] text-slate-400 font-light mt-6">
            New to Gestor?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
