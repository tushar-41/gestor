"use client";

import { useEffect, useState, useRef } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import EditProjectModal from "@/components/EditProjectModal";

const STATUS_STYLES = {
  PLANNING: {
    color: "#6366f1",
    bg: "#eef2ff",
    dot: "#818cf8",
    label: "Planning",
  },
  IN_PROGRESS: {
    color: "#d97706",
    bg: "#fffbeb",
    dot: "#fbbf24",
    label: "In Progress",
  },
  ON_HOLD: {
    color: "#dc2626",
    bg: "#fef2f2",
    dot: "#f87171",
    label: "On Hold",
  },
  COMPLETED: {
    color: "#059669",
    bg: "#ecfdf5",
    dot: "#34d399",
    label: "Completed",
  },
  ARCHIVED: {
    color: "#64748b",
    bg: "#f8fafc",
    dot: "#94a3b8",
    label: "Archived",
  },
};

const CATEGORY_COLORS = [
  { bg: "#ede9fe", color: "#7c3aed" },
  { bg: "#fce7f3", color: "#be185d" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fff3cd", color: "#92400e" },
  { bg: "#dbeafe", color: "#1d4ed8" },
  { bg: "#fef3c7", color: "#b45309" },
];

function categoryColor(category) {
  if (!category) return CATEGORY_COLORS[0];
  const idx = category.charCodeAt(0) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[idx];
}

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function ProjectViewModal({
  projectId,
  onClose,
  onProjectUpdated,
  onProjectDeleted,
}) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [removingTopicId, setRemovingTopicId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/api/projects/${projectId}`);
      setProject(data);
    } catch {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeletingProject(true);
    try {
      await apiCall(`/api/projects/${projectId}`, { method: "DELETE" });
      toast.success("Project deleted");
      onProjectDeleted?.(projectId);
      onClose();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeletingProject(false);
    }
  };

  const handleRemoveTopic = async (topicId) => {
    setRemovingTopicId(topicId);
    try {
      const updated = await apiCall(
        `/api/projects/${projectId}/topics/${topicId}`,
        { method: "DELETE" },
      );
      setProject(updated);
      toast.success("Topic removed");
    } catch {
      toast.error("Failed to remove topic");
    } finally {
      setRemovingTopicId(null);
    }
  };

  const handleProjectUpdated = (updated) => {
    setProject(updated);
    setEditOpen(false);
    onProjectUpdated?.(updated);
    toast.success("Project updated");
  };

  if (!projectId) return null;

  const status = project
    ? STATUS_STYLES[project.status] || STATUS_STYLES.PLANNING
    : null;
  const progress = project?.durationDays
    ? Math.min(
        100,
        Math.round(
          ((Date.now() - new Date(project.startDate)) /
            (project.durationDays * 86400000)) *
            100,
        ),
      )
    : null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(10,15,30,0.6)",
          backdropFilter: "blur(8px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full flex flex-col"
          style={{
            maxWidth: 760,
            maxHeight: "90vh",
            background: "#fff",
            borderRadius: 20,
            boxShadow:
              "0 40px 100px rgba(10,15,30,0.25), 0 0 0 1px rgba(99,102,241,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Top accent */}
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
              flexShrink: 0,
            }}
          />

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 320,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: "3px solid #e0e7ff",
                    borderTop: "3px solid #6366f1",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    margin: "0 auto 12px",
                  }}
                />
                <p style={{ fontSize: 13, color: "#94a3b8" }}>
                  Loading project...
                </p>
              </div>
            </div>
          ) : project ? (
            <>
              {/* Header */}
              <div style={{ padding: "24px 28px 0", flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 11px",
                          borderRadius: 20,
                          background: status.bg,
                          color: status.color,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.4px",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
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
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            color: "#475569",
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#0f172a",
                        letterSpacing: "-0.5px",
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {project.name}
                    </h2>
                    {project.description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "#64748b",
                          lineHeight: 1.6,
                        }}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={() => setEditOpen(true)}
                      style={actionBtnStyle("#eef2ff", "#6366f1")}
                      title="Edit"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      style={actionBtnStyle("#fef2f2", "#ef4444")}
                      title="Delete"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <polyline
                          points="3 6 5 6 21 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={onClose}
                      style={actionBtnStyle("#f8fafc", "#475569")}
                      title="Close"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 6L6 18M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {["overview", "topics", "timeline"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "10px 18px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: activeTab === tab ? "#6366f1" : "#94a3b8",
                        borderBottom: `2px solid ${activeTab === tab ? "#6366f1" : "transparent"}`,
                        background: "none",
                        border: "none",
                        borderBottom: `2px solid ${activeTab === tab ? "#6366f1" : "transparent"}`,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "all 0.15s",
                        letterSpacing: "0.2px",
                        marginBottom: -1,
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px 28px 28px",
                }}
              >
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                    }}
                  >
                    {/* Stats row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 12,
                      }}
                    >
                      <StatCard
                        icon={topicIcon}
                        label="Topics"
                        value={project.topics?.length ?? 0}
                        accent="#6366f1"
                      />
                      <StatCard
                        icon={calendarIcon}
                        label="Duration"
                        value={
                          project.durationDays
                            ? `${project.durationDays}d`
                            : "—"
                        }
                        accent="#8b5cf6"
                      />
                      <StatCard
                        icon={clockIcon}
                        label="Updated"
                        value={timeAgo(project.updatedAt)}
                        accent="#a78bfa"
                      />
                    </div>

                    {/* Progress bar (if in progress and has dates) */}
                    {progress !== null && project.status === "IN_PROGRESS" && (
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: 12,
                          padding: "16px 18px",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Timeline Progress
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#6366f1",
                            }}
                          >
                            {Math.max(0, progress)}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 6,
                            background: "#e2e8f0",
                            borderRadius: 99,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.max(0, progress)}%`,
                              background:
                                "linear-gradient(90deg, #6366f1, #8b5cf6)",
                              borderRadius: 99,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 6,
                          }}
                        >
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>
                            {fmt(project.startDate)}
                          </span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>
                            {fmt(project.endDate)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Meta info */}
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        border: "1px solid #f1f5f9",
                        overflow: "hidden",
                      }}
                    >
                      {[
                        {
                          label: "Start Date",
                          value: fmt(project.startDate) || "—",
                        },
                        {
                          label: "End Date",
                          value: fmt(project.endDate) || "—",
                        },
                        { label: "Created", value: fmt(project.createdAt) },
                        {
                          label: "Last Updated",
                          value: fmt(project.updatedAt),
                        },
                        { label: "Project ID", value: `#${project.id}` },
                      ].map((item, i, arr) => (
                        <div
                          key={item.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "11px 16px",
                            borderBottom:
                              i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "#94a3b8",
                              fontWeight: 500,
                            }}
                          >
                            {item.label}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#334155",
                              fontWeight: 600,
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOPICS TAB */}
                {activeTab === "topics" && (
                  <div>
                    {project.topics?.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 0",
                          color: "#94a3b8",
                        }}
                      >
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>
                          No topics linked yet
                        </p>
                        <p style={{ fontSize: 12, marginTop: 4 }}>
                          Edit the project to add topics
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {project.topics.map((topic) => {
                          const cc = categoryColor(topic.category);
                          const isRemoving = removingTopicId === topic.id;
                          return (
                            <div
                              key={topic.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 16px",
                                borderRadius: 12,
                                background: "#fff",
                                border: "1.5px solid #f1f5f9",
                                transition: "border-color 0.15s",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                }}
                              >
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: cc.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <span style={{ fontSize: 15 }}>📌</span>
                                </div>
                                <div>
                                  <p
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 600,
                                      color: "#1e293b",
                                    }}
                                  >
                                    {topic.name}
                                  </p>
                                  {topic.category && (
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 500,
                                        color: cc.color,
                                        background: cc.bg,
                                        padding: "2px 8px",
                                        borderRadius: 20,
                                        display: "inline-block",
                                        marginTop: 2,
                                      }}
                                    >
                                      {topic.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveTopic(topic.id)}
                                disabled={isRemoving}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 30,
                                  height: 30,
                                  borderRadius: 8,
                                  background: isRemoving
                                    ? "#f8fafc"
                                    : "#fef2f2",
                                  border: "none",
                                  color: isRemoving ? "#94a3b8" : "#ef4444",
                                  cursor: isRemoving
                                    ? "not-allowed"
                                    : "pointer",
                                  transition: "all 0.15s",
                                }}
                                title="Remove topic"
                              >
                                {isRemoving ? (
                                  <span
                                    style={{
                                      width: 12,
                                      height: 12,
                                      border: "2px solid #cbd5e1",
                                      borderTop: "2px solid #94a3b8",
                                      borderRadius: "50%",
                                      display: "inline-block",
                                      animation: "spin 0.7s linear infinite",
                                    }}
                                  />
                                ) : (
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M18 6L6 18M6 6l12 12"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <button
                      onClick={() => setEditOpen(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        width: "100%",
                        marginTop: 12,
                        padding: "11px 0",
                        borderRadius: 12,
                        background: "#f5f3ff",
                        border: "1.5px dashed #c4b5fd",
                        color: "#6366f1",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Add Topics
                    </button>
                  </div>
                )}

                {/* TIMELINE TAB */}
                {activeTab === "timeline" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {[
                      {
                        label: "Project Created",
                        date: project.createdAt,
                        icon: "🚀",
                        color: "#6366f1",
                        bg: "#eef2ff",
                      },
                      project.startDate && {
                        label: "Start Date",
                        date: project.startDate,
                        icon: "📅",
                        color: "#10b981",
                        bg: "#ecfdf5",
                      },
                      project.updatedAt !== project.createdAt && {
                        label: "Last Updated",
                        date: project.updatedAt,
                        icon: "✏️",
                        color: "#f59e0b",
                        bg: "#fffbeb",
                      },
                      project.endDate && {
                        label: "End Date",
                        date: project.endDate,
                        icon: "🏁",
                        color: "#8b5cf6",
                        bg: "#f5f3ff",
                      },
                    ]
                      .filter(Boolean)
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((event, i, arr) => (
                        <div
                          key={event.label}
                          style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: event.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                              }}
                            >
                              {event.icon}
                            </div>
                            {i < arr.length - 1 && (
                              <div
                                style={{
                                  width: 2,
                                  flex: 1,
                                  background: "#f1f5f9",
                                  minHeight: 20,
                                  margin: "4px 0",
                                }}
                              />
                            )}
                          </div>
                          <div style={{ paddingTop: 6 }}>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#1e293b",
                              }}
                            >
                              {event.label}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "#94a3b8",
                                marginTop: 1,
                              }}
                            >
                              {fmt(event.date)} · {timeAgo(event.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
              Project not found
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{
            background: "rgba(10,15,30,0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              maxWidth: 380,
              width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4M12 17h.01"
                  stroke="#ef4444"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0f172a",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Delete Project?
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                textAlign: "center",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              This will permanently delete <strong>"{project?.name}"</strong>{" "}
              and all its associations. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingProject}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: deletingProject ? "#fca5a5" : "#ef4444",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {deletingProject ? (
                  <>
                    <span
                      style={{
                        width: 13,
                        height: 13,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTop: "2px solid #fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && project && (
        <EditProjectModal
          project={project}
          onClose={() => setEditOpen(false)}
          onUpdate={handleProjectUpdated}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 12,
        padding: "14px 16px",
        border: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span style={{ color: accent }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </span>
      </div>
      <p style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{value}</p>
    </div>
  );
}

const topicIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.7"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.7"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.4"
    />
  </svg>
);
const calendarIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const clockIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function actionBtnStyle(bg, color) {
  return {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: bg,
    border: "none",
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    flexShrink: 0,
  };
}
