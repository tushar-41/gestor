"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API endpoint when available
        const response = await apiCall("/api/projects");
        if (response && Array.isArray(response)) {
          setProjects(response);
        }
      } catch (error) {
        toast.error("Failed to load projects");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Projects
          </h1>
          <p className="text-[14px] text-slate-500 font-light">
            Manage your projects and linked topics
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500">No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-[16px] font-semibold text-slate-900 mb-2">
                {project.name}
              </h3>
              <p className="text-[13px] text-slate-600 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-slate-500">
                  {project.topicCount || 0} topics
                </span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
