"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function LearningPathPage() {
  const [learningPath, setLearningPath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API endpoint when available
        const response = await apiCall("/api/learning-path");
        if (response) {
          setLearningPath(response);
        }
      } catch (error) {
        toast.error("Failed to load learning path");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <h1
        className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Learning Path
      </h1>
      <p className="text-[14px] text-slate-500 font-light mb-8">
        Track your learning journey and progression
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-slate-500">Coming soon...</p>
      </div>
    </div>
  );
}
