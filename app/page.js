import FeaturesSection from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/hero";
import HowItWorksSection from "@/components/Howitworks";
import Navbar from "@/components/Navbar";

export default function Home() {
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
