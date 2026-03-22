"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FeaturesSection from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/hero";
import HowItWorksSection from "@/components/Howitworks";
import Navbar from "@/components/Navbar";
import { getToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    const token = getToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}

