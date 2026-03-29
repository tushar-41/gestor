"use client";

import { useState, useEffect, useRef } from "react";
import { apiCall } from "@/lib/auth";

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning", color: "#6366f1", bg: "#eef2ff" },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "#d97706",
    bg: "#fffbeb",
  },
  { value: "ON_HOLD", label: "On Hold", color: "#dc2626", bg: "#fef2f2" },
  { value: "COMPLETED", label: "Completed", color: "#059669", bg: "#ecfdf5" },
  { value: "ARCHIVED", label: "Archived", color: "#64748b", bg: "#f8fafc" },
];

export default function EditProjectModal({ project, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: project.name || "",
    description: project.description || "",
    githubUrl: project.githubUrl || "",
    startDate: project.startDate?.split("T")[0] || "",
    endDate: project.endDate?.split("T")[0] || "",
    status: project.status || "PLANNING",
    topicIds: project.topics?.map((t) => t.id) || [],
  });

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchTopics();
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleTopic = (id) => {
    setForm((p) => ({
      ...p,
      topicIds: p.topicIds.includes(id)
        ? p.topicIds.filter((t) => t !== id)
        : [...p.topicIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await apiCall(`/api/projects/${project.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
        }),
      });
      onUpdate(updated);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTopics = topics.filter((t) => form.topicIds.includes(t.id));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,30,0.65)", backdropFilter: "blur(6px)" }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 32px 80px rgba(10,15,30,0.22), 0 0 0 1px rgba(99,102,241,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Accent */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, #8b5cf6, #6366f1, #a78bfa)",
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#f5f3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Edit Project
              </h2>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                ID #{project.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Field label="Project Name *">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Project name"
                style={inp}
                onFocus={(e) => Object.assign(e.target.style, inpF)}
                onBlur={(e) => Object.assign(e.target.style, inp)}
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Project description..."
                style={{ ...inp, resize: "none" }}
                onFocus={(e) => Object.assign(e.target.style, inpF)}
                onBlur={(e) => Object.assign(e.target.style, inp)}
              />
            </Field>

            <Field label="GitHub URL">
              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                style={inp}
                onFocus={(e) => Object.assign(e.target.style, inpF)}
                onBlur={(e) => Object.assign(e.target.style, inp)}
              />
            </Field>

            <Field label="Status">
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, status: s.value }))}
                    style={{
                      padding: "5px 13px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      border: `1.5px solid ${form.status === s.value ? s.color : "#e2e8f0"}`,
                      background: form.status === s.value ? s.bg : "#fff",
                      color: form.status === s.value ? s.color : "#94a3b8",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Field>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="Start Date">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  style={inp}
                  onFocus={(e) => Object.assign(e.target.style, inpF)}
                  onBlur={(e) => Object.assign(e.target.style, inp)}
                />
              </Field>
              <Field label="End Date">
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  style={inp}
                  onFocus={(e) => Object.assign(e.target.style, inpF)}
                  onBlur={(e) => Object.assign(e.target.style, inp)}
                />
              </Field>
            </div>

            {/* Topics multi-select */}
            <Field label="Topics">
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
                        padding: "3px 10px",
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
                        onClick={() => toggleTopic(t.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          color: "#818cf8",
                          display: "flex",
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
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
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setTopicDropdownOpen((p) => !p)}
                  style={{
                    ...inp,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    width: "100%",
                    ...(topicDropdownOpen ? inpF : {}),
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: form.topicIds.length ? "#0f172a" : "#94a3b8",
                    }}
                  >
                    {form.topicIds.length
                      ? `${form.topicIds.length} topic${form.topicIds.length > 1 ? "s" : ""} selected`
                      : "Select topics..."}
                  </span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      color: "#94a3b8",
                      transform: topicDropdownOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
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
                {topicDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
                      maxHeight: 180,
                      overflowY: "auto",
                      zIndex: 10,
                    }}
                  >
                    {topicsLoading ? (
                      <div
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: 13,
                        }}
                      >
                        Loading...
                      </div>
                    ) : (
                      topics.map((t) => {
                        const sel = form.topicIds.includes(t.id);
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
                              padding: "9px 14px",
                              background: sel ? "#f5f3ff" : "transparent",
                              border: "none",
                              borderBottom: "1px solid #f8fafc",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background 0.1s",
                            }}
                          >
                            <div
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 4,
                                border: `1.5px solid ${sel ? "#6366f1" : "#cbd5e1"}`,
                                background: sel ? "#6366f1" : "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.15s",
                              }}
                            >
                              {sel && (
                                <svg
                                  width="9"
                                  height="9"
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
                                color: sel ? "#4f46e5" : "#334155",
                                fontWeight: sel ? 500 : 400,
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
            </Field>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "14px 24px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 11,
                fontSize: 13,
                fontWeight: 600,
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.name}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 11,
                fontSize: 13,
                fontWeight: 600,
                background:
                  isSubmitting || !form.name
                    ? "#c4b5fd"
                    : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                border: "none",
                color: "#fff",
                cursor: isSubmitting || !form.name ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                boxShadow: "0 4px 14px rgba(139,92,246,0.3)",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inp = {
  width: "100%",
  padding: "10px 13px",
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
const inpF = {
  ...inp,
  background: "#fff",
  border: "1.5px solid #818cf8",
  boxShadow: "0 0 0 3px rgba(129,140,248,0.12)",
};
