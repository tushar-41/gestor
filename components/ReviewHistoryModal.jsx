"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtFull(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s <= rating ? "#3b82f6" : "#e2e8f0"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewHistoryModal({ topicId, topicName, onClose }) {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  // inline quick-review
  const [showQuick, setShowQuick] = useState(false);
  const [quickForm, setQuickForm] = useState({
    rating: 0,
    timeSpentMinutes: "",
    notes: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (topicId) load();
  }, [topicId]);

  const load = async () => {
    setLoading(true);
    try {
      const [hist, lat] = await Promise.all([
        apiCall(`/api/reviews/topics/${topicId}`),
        apiCall(`/api/reviews/topics/${topicId}/latest`).catch(() => null),
      ]);
      setHistory(Array.isArray(hist) ? hist : []);
      setLatest(lat || null);
    } catch {
      toast.error("Failed to load review history");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReview = async (e) => {
    e.preventDefault();
    if (!quickForm.rating) return;
    setSubmitting(true);
    try {
      await apiCall(`/api/reviews/topics/${topicId}`, {
        method: "POST",
        body: JSON.stringify({
          rating: Number(quickForm.rating),
          timeSpentMinutes: Number(quickForm.timeSpentMinutes) || 0,
          notes: quickForm.notes,
        }),
      });
      toast.success("Review recorded!");
      setShowQuick(false);
      setQuickForm({ rating: 0, timeSpentMinutes: "", notes: "" });
      load();
    } catch {
      toast.error("Failed to record review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = history.length
    ? (history.reduce((s, r) => s + r.rating, 0) / history.length).toFixed(1)
    : null;
  const totalTime = history.reduce((s, r) => s + (r.timeSpentMinutes || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 32px 80px rgba(15,23,42,0.2), 0 0 0 1px rgba(59,130,246,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Accent */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg,#3b82f6,#1d4ed8,#60a5fa)",
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
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Review History
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "#3b82f6",
                  fontWeight: 600,
                  marginTop: 1,
                }}
              >
                {topicName}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowQuick((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 13px",
                borderRadius: 9,
                background: showQuick ? "#dbeafe" : "#eff6ff",
                border: "1.5px solid #bfdbfe",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              Quick Review
            </button>
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
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Quick review form */}
          {showQuick && (
            <form
              onSubmit={handleQuickReview}
              style={{
                padding: "16px 24px",
                background: "#f0f9ff",
                borderBottom: "1.5px solid #bae6fd",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0369a1",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 12,
                }}
              >
                Quick Review Entry
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                {/* Stars */}
                <div>
                  <label style={fieldLabel}>Rating *</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoveredStar(s)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() =>
                          setQuickForm((p) => ({ ...p, rating: s }))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 1,
                          transform:
                            (hoveredStar || quickForm.rating) >= s
                              ? "scale(1.2)"
                              : "scale(1)",
                          transition: "transform 0.1s",
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill={
                            (hoveredStar || quickForm.rating) >= s
                              ? "#3b82f6"
                              : "#e2e8f0"
                          }
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Time */}
                <div>
                  <label style={fieldLabel}>Minutes</label>
                  <input
                    type="number"
                    value={quickForm.timeSpentMinutes}
                    min="0"
                    placeholder="0"
                    onChange={(e) =>
                      setQuickForm((p) => ({
                        ...p,
                        timeSpentMinutes: e.target.value,
                      }))
                    }
                    style={{ ...qInp, width: 80 }}
                  />
                </div>
                {/* Notes */}
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label style={fieldLabel}>Notes</label>
                  <input
                    type="text"
                    value={quickForm.notes}
                    placeholder="Brief note..."
                    onChange={(e) =>
                      setQuickForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    style={qInp}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!quickForm.rating || submitting}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 9,
                    background:
                      quickForm.rating && !submitting
                        ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                        : "#bfdbfe",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor:
                      quickForm.rating && !submitting
                        ? "pointer"
                        : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    boxShadow: "0 2px 8px rgba(59,130,246,0.25)",
                  }}
                >
                  {submitting ? (
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid #fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                  ) : null}
                  Save
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 60,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "3px solid #dbeafe",
                  borderTop: "3px solid #3b82f6",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            </div>
          ) : (
            <div style={{ padding: "20px 24px 28px" }}>
              {/* Summary mini-stats */}
              {history.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {[
                    { label: "Sessions", value: history.length },
                    {
                      label: "Avg Rating",
                      value: avgRating ? `${avgRating} / 5` : "—",
                    },
                    { label: "Total Time", value: `${totalTime}m` },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "#f0f9ff",
                        border: "1.5px solid #bae6fd",
                        borderRadius: 12,
                        padding: "12px 14px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#1e40af",
                        }}
                      >
                        {s.value}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                          marginTop: 2,
                        }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Latest review highlight */}
              {latest && (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1.5px solid #bfdbfe",
                    borderRadius: 14,
                    padding: "14px 16px",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#3b82f6",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Latest Session
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {timeAgo(latest.reviewedAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <StarRating rating={latest.rating} size={15} />
                    <span style={{ fontSize: 13, color: "#475569" }}>
                      {latest.timeSpentMinutes}m spent
                    </span>
                    {latest.nextReviewDate && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#3b82f6",
                          fontWeight: 600,
                        }}
                      >
                        Next review: {fmt(latest.nextReviewDate)}
                      </span>
                    )}
                  </div>
                  {latest.notes && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#475569",
                        marginTop: 6,
                        fontStyle: "italic",
                      }}
                    >
                      "{latest.notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Full history */}
              {history.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#94a3b8",
                  }}
                >
                  <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>
                    No reviews recorded yet
                  </p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    Use Quick Review above to add your first session
                  </p>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: 10,
                    }}
                  >
                    All Sessions
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {history.map((r, i) => (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Timeline dot */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexShrink: 0,
                            paddingTop: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: i === 0 ? "#3b82f6" : "#bfdbfe",
                              border:
                                i === 0
                                  ? "2px solid #1d4ed8"
                                  : "2px solid #93c5fd",
                            }}
                          />
                          {i < history.length - 1 && (
                            <div
                              style={{
                                width: 2,
                                height: 32,
                                background: "#dbeafe",
                                margin: "3px 0",
                              }}
                            />
                          )}
                        </div>

                        {/* Card */}
                        <div
                          style={{
                            flex: 1,
                            background: "#fff",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: 12,
                            padding: "11px 14px",
                            marginBottom: i < history.length - 1 ? 0 : 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 6,
                            }}
                          >
                            <StarRating rating={r.rating} size={13} />
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                              {timeAgo(r.reviewedAt)}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              flexWrap: "wrap",
                            }}
                          >
                            <span style={{ fontSize: 12, color: "#64748b" }}>
                              <span style={{ color: "#93c5fd" }}>⏱</span>{" "}
                              {r.timeSpentMinutes}m
                            </span>
                            <span style={{ fontSize: 12, color: "#64748b" }}>
                              <span style={{ color: "#93c5fd" }}>📅</span>{" "}
                              {fmtFull(r.reviewedAt)}
                            </span>
                            {r.nextReviewDate && (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#3b82f6",
                                  fontWeight: 500,
                                }}
                              >
                                Next: {fmt(r.nextReviewDate)}
                              </span>
                            )}
                          </div>
                          {r.notes && (
                            <p
                              style={{
                                fontSize: 12,
                                color: "#475569",
                                marginTop: 5,
                                fontStyle: "italic",
                                lineHeight: 1.5,
                              }}
                            >
                              "{r.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const fieldLabel = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  color: "#0369a1",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: 4,
};
const qInp = {
  padding: "8px 11px",
  borderRadius: 9,
  border: "1.5px solid #bae6fd",
  fontSize: 13,
  color: "#1e293b",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};
