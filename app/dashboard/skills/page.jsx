"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const response = await apiCall("/api/skills");
        if (response && Array.isArray(response)) {
          setSkills(response);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading skills...</p>
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
        Skill Evolution
      </h1>
      <p className="text-[14px] text-slate-500 font-light mb-8">
        Track your skill progression from manual to automated tasks
      </p>

      {skills.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500">
            No skills tracked yet. Start learning!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[18px] font-semibold text-slate-900">
                    {skill.name}
                  </h3>
                  <p className="text-[13px] text-slate-500">
                    Level:{" "}
                    <span className="font-semibold text-blue-600">
                      {skill.level}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <p className="text-slate-600">Progress</p>
                  <p className="font-semibold text-slate-800">
                    {skill.progress}%
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                <p className="text-[12px] text-slate-500">
                  Started: {new Date(skill.startDate).toLocaleDateString()}
                </p>
                {skill.masteredDate && (
                  <p className="text-[12px] text-green-600 font-medium">
                    ✓ Mastered:{" "}
                    {new Date(skill.masteredDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
