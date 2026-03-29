"use client";

import { apiCall } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning", color: "#6366f1", bg: "#eef2ff" },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  { value: "ON_HOLD", label: "On Hold", color: "#ef4444", bg: "#fef2f2" },
  { value: "COMPLETED", label: "Completed", color: "#10b981", bg: "#ecfdf5" },
  { value: "ARCHIVED", label: "Archived", color: "#94a3b8", bg: "#f8fafc" },
];

export default function CreateProjectModal({
  isOpen = false,
  onClose,
  onCreate,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    status: "PLANNING",
    topicIds: [],
  });

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchTopics();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTopics = async () => {
    setTopicsLoading(true);
    try {
      const res = await apiCall("/api/topics");
      setTopics(res?.data || res || []);
    } catch {
      setTopics([]);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTopic = (id) => {
    setForm((prev) => ({
      ...prev,
      topicIds: prev.topicIds.includes(id)
        ? prev.topicIds.filter((t) => t !== id)
        : [...prev.topicIds, id],
    }));
  };

  const removeTopic = (id) => {
    setForm((prev) => ({
      ...prev,
      topicIds: prev.topicIds.filter((t) => t !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate({
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === form.status);
  const selectedTopics = topics.filter((t) => form.topicIds.includes(t.id));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow:
            "0 32px 80px rgba(15,23,42,0.22), 0 0 0 1px rgba(15,23,42,0.06)",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            height: 4,
          }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-7 pt-6 pb-5"
          style={{ borderBottom: "1px solid #f1f5f9" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 38, height: 38, background: "#eef2ff" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            <div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                Create New Project
              </h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                Fill in the details to get started
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl transition-all"
            style={{
              width: 34,
              height: 34,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#94a3b8",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#475569";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div
            className="px-7 py-5 space-y-5"
            style={{ maxHeight: "62vh", overflowY: "auto" }}
          >
            {/* Project Name */}
            <div>
              <Label>
                Project Name <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Customer Portal v2, ML Pipeline"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                name="description"
                placeholder="Briefly describe the project goal or scope..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* GitHub URL */}
            <div>
              <Label>GitHub URL</Label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </span>
                <input
                  type="url"
                  name="githubUrl"
                  placeholder="https://github.com/username/repo"
                  value={form.githubUrl}
                  onChange={handleChange}
                  style={{ ...inputStyle, paddingLeft: 38 }}
                  onFocus={(e) =>
                    Object.assign(e.target.style, {
                      ...inputFocusStyle,
                      paddingLeft: "38px",
                    })
                  }
                  onBlur={(e) =>
                    Object.assign(e.target.style, {
                      ...inputStyle,
                      paddingLeft: "38px",
                    })
                  }
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, status: s.value }))}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      border: `1.5px solid ${form.status === s.value ? s.color : "#e2e8f0"}`,
                      background: form.status === s.value ? s.bg : "#fff",
                      color: form.status === s.value ? s.color : "#94a3b8",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <Label>Start Date</Label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>

            {/* Topics Multi-select */}
            <div ref={dropdownRef}>
              <Label>Topics</Label>

              {/* Selected Tags */}
              {selectedTopics.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  {selectedTopics.map((t) => (
                    <span
                      key={t.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: "#eef2ff",
                        border: "1px solid #c7d2fe",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#4f46e5",
                      }}
                    >
                      {t.name || t.title}
                      <button
                        type="button"
                        onClick={() => removeTopic(t.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          color: "#818cf8",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Dropdown trigger */}
              <button
                type="button"
                onClick={() => setTopicDropdownOpen((p) => !p)}
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                  ...(topicDropdownOpen ? inputFocusStyle : {}),
                }}
              >
                <span
                  style={{
                    color: form.topicIds.length ? "#0f172a" : "#94a3b8",
                    fontSize: 14,
                  }}
                >
                  {form.topicIds.length
                    ? `${form.topicIds.length} topic${form.topicIds.length > 1 ? "s" : ""} selected`
                    : "Select topics..."}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    color: "#94a3b8",
                    transform: topicDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown list */}
              {topicDropdownOpen && (
                <div
                  style={{
                    marginTop: 4,
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {topicsLoading ? (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: 13,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          border: "2px solid #e2e8f0",
                          borderTop: "2px solid #6366f1",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          marginRight: 8,
                          verticalAlign: "middle",
                        }}
                      />
                      Loading topics...
                    </div>
                  ) : topics.length === 0 ? (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: 13,
                      }}
                    >
                      No topics found
                    </div>
                  ) : (
                    topics.map((t) => {
                      const isSelected = form.topicIds.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTopic(t.id)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 14px",
                            background: isSelected ? "#f5f3ff" : "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            borderBottom: "1px solid #f8fafc",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.background = "#f8fafc";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 4,
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `1.5px solid ${isSelected ? "#6366f1" : "#cbd5e1"}`,
                              background: isSelected ? "#6366f1" : "#fff",
                              transition: "all 0.15s",
                            }}
                          >
                            {isSelected && (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="#fff"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              color: isSelected ? "#4f46e5" : "#334155",
                              fontWeight: isSelected ? 500 : 400,
                            }}
                          >
                            {t.name || t.title}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "16px 28px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                color: "#475569",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.name}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                background:
                  isSubmitting || !form.name
                    ? "#a5b4fc"
                    : "linear-gradient(135deg, blue 0%, blue 100%)",
                border: "none",
                color: "#fff",
                cursor: isSubmitting || !form.name ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow:
                  isSubmitting || !form.name
                    ? "none"
                    : "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        `}</style>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.7px",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  background: "#f8fafc",
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  transition: "all 0.15s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const inputFocusStyle = {
  ...inputStyle,
  background: "#fff",
  border: "1.5px solid #818cf8",
  boxShadow: "0 0 0 3px rgba(129,140,248,0.12)",
};
