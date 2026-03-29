"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectViewModal from "@/components/ProjectViewModal";

const STATUS_STYLES = {
  PLANNING: {
    color: "#6366f1",
    bg: "#eef2ff",
    dot: "#818cf8",
    label: "Planning",
  },
  IN_PROGRESS: {
    color: "#f59e0b",
    bg: "#fffbeb",
    dot: "#fbbf24",
    label: "In Progress",
  },
  ON_HOLD: {
    color: "#ef4444",
    bg: "#fef2f2",
    dot: "#f87171",
    label: "On Hold",
  },
  COMPLETED: {
    color: "#10b981",
    bg: "#ecfdf5",
    dot: "#34d399",
    label: "Completed",
  },
  ARCHIVED: {
    color: "#94a3b8",
    bg: "#f8fafc",
    dot: "#cbd5e1",
    label: "Archived",
  },
};

const STATUS_FILTERS = [
  "ALL",
  "PLANNING",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProjectId, setViewingProjectId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const url =
        statusFilter === "ALL"
          ? "/api/projects"
          : `/api/projects?status=${statusFilter}`;
      const response = await apiCall(url);
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

  const fetchCount = async () => {
    try {
      const count = await apiCall("/api/projects/count");
      setProjectCount(count);
    } catch {}
  };

  const handleCreateProject = async (formData) => {
    try {
      const response = await apiCall("/api/projects", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setProjects((prev) => [response, ...prev]);
      setProjectCount((c) => (c ?? 0) + 1);
      setIsModalOpen(false);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    }
  };

  const handleProjectUpdated = (updated) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleProjectDeleted = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setProjectCount((c) => Math.max(0, (c ?? 1) - 1));
    setViewingProjectId(null);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1
              className="text-[32px] font-semibold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Projects
            </h1>
            {projectCount !== null && (
              <span
                className="text-[12px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#eef2ff", color: "#6366f1" }}
              >
                {projectCount}
              </span>
            )}
          </div>
          <p className="text-[14px] text-slate-500 font-light">
            Manage your projects and linked topics
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          New Project
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => {
          const s = STATUS_STYLES[f];
          const active = statusFilter === f;
          return (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-all"
              style={{
                border: `1.5px solid ${active ? s?.color || "#6366f1" : "#e2e8f0"}`,
                background: active ? s?.bg || "#eef2ff" : "#fff",
                color: active ? s?.color || "#6366f1" : "#94a3b8",
                cursor: "pointer",
              }}
            >
              {f === "ALL" ? "All Projects" : s?.label || f}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <div
            className="flex items-center justify-center rounded-2xl mx-auto mb-4"
            style={{ width: 56, height: 56, background: "#eef2ff" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="#6366f1" />
              <rect
                x="13"
                y="3"
                width="8"
                height="8"
                rx="2"
                fill="#a78bfa"
                opacity="0.6"
              />
              <rect
                x="3"
                y="13"
                width="8"
                height="8"
                rx="2"
                fill="#a78bfa"
                opacity="0.6"
              />
              <rect
                x="13"
                y="13"
                width="8"
                height="8"
                rx="2"
                fill="#6366f1"
                opacity="0.3"
              />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-slate-700 mb-1">
            {statusFilter === "ALL"
              ? "No projects yet"
              : `No ${STATUS_STYLES[statusFilter]?.label || statusFilter} projects`}
          </p>
          <p className="text-[13px] text-slate-400 mb-5">
            {statusFilter === "ALL"
              ? "Create your first project to get started"
              : "Try a different filter or create a new project"}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            Create Project
          </button>
        </div>
      ) : (
        /* Project Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const status =
              STATUS_STYLES[project.status] || STATUS_STYLES.PLANNING;
            return (
              <div
                key={project.id}
                onClick={() => setViewingProjectId(project.id)}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all group cursor-pointer"
                style={{ position: "relative", overflow: "hidden" }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: status.color,
                    borderRadius: "0 2px 2px 0",
                  }}
                />

                <div style={{ paddingLeft: 4 }}>
                  {/* Status badge + GitHub */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                      style={{
                        background: status.bg,
                        color: status.color,
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: status.dot,
                          display: "inline-block",
                        }}
                      />
                      {status.label}
                    </span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-300 hover:text-slate-600 transition-colors"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Title & description */}
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-[13px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                    {project.description || "No description provided."}
                  </p>

                  {/* Topic chips (up to 3) */}
                  {project.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.topics.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: "#f5f3ff", color: "#7c3aed" }}
                        >
                          {t.name}
                        </span>
                      ))}
                      {project.topics.length > 3 && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ background: "#f8fafc", color: "#94a3b8" }}
                        >
                          +{project.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid #f1f5f9" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[12px] text-slate-400">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="7"
                            height="7"
                            rx="1.5"
                            fill="currentColor"
                            opacity="0.5"
                          />
                          <rect
                            x="14"
                            y="3"
                            width="7"
                            height="7"
                            rx="1.5"
                            fill="currentColor"
                            opacity="0.5"
                          />
                          <rect
                            x="3"
                            y="14"
                            width="7"
                            height="7"
                            rx="1.5"
                            fill="currentColor"
                            opacity="0.5"
                          />
                        </svg>
                        {project.topics?.length ?? 0} topics
                      </span>
                      {project.durationDays > 0 && (
                        <span className="text-[11px] text-slate-400">
                          {project.durationDays}d
                        </span>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <span className="text-[11px] text-slate-400">
                        {project.startDate
                          ? new Date(project.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )
                          : ""}
                        {project.startDate && project.endDate ? " → " : ""}
                        {project.endDate
                          ? new Date(project.endDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : ""}
                      </span>
                    )}
                    <span className="text-[12px] font-medium text-indigo-400 group-hover:text-indigo-600 transition-colors">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* View Modal — only mounts when a project is selected */}
      {viewingProjectId && (
        <ProjectViewModal
          projectId={viewingProjectId}
          onClose={() => setViewingProjectId(null)}
          onProjectUpdated={handleProjectUpdated}
          onProjectDeleted={handleProjectDeleted}
        />
      )}
    </div>
  );
}
