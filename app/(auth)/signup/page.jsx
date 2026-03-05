"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    password: "",
  });
  const [isLoading, setIsLaoding] = useState(false);
  const [passType, setPassType] = useState(true);
  const router = useRouter();

  function handleForm(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    setIsLaoding(true);
    e.preventDefault();

    try {
      const response = await fetch(
        "https://devpathtracker-production.up.railway.app/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      console.log(result);
      setIsLaoding(false);
      setForm({ name: "", password: "" });
      toast.success("Welcome to Gestor please Login " + result.username);
      router.replace("/login");
    } catch (error) {
      setIsLaoding(false);
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-neutral-900 to-neutral-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-neutral-900 border border-neutral-700 p-8 rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Register to <span className="font-bold text-gray-500">Gestor</span>
        </h2>

        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleForm}
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-neutral-500 transition"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Password</label>

          <div className="relative">
            <input
              type={passType ? "password" : "text"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleForm}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-neutral-500 transition pr-16"
            />

            <button
              type="button"
              onClick={() => setPassType((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300 transition"
            >
              {passType ? "Show" : "Hide"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-semibold"
        >
          {isLoading ? (
            <span className="animate-pulse text-xl">Registering...</span>
          ) : (
            "Signup"
          )}
        </button>
        <p className="text-gray-500 dark:text-white text-sm text-center">
          Already have an account ?{" "}
          <Link href={"/login"} className="text-sm text-pink-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
