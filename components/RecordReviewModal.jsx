"use client";

import { useState } from "react";
import { apiCall } from "@/lib/auth";

export default function RecordReviewModal({
  topicId,
  topicName,
  topics,
  onClose,
  onRecorded,
}) {
  const [form, setForm] = useState({
    topicId: topicId || (topics[0]?.id ?? ""),
    rating: 0,
    timeSpentMinutes: "",
    notes: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) {
      return;
    }
    setIsSubmitting(true);
    try {
      await apiCall(`/api/reviews/topics/${form.topicId}`, {
        method: "POST",
        body: JSON.stringify({
          rating: Number(form.rating),
          timeSpentMinutes: Number(form.timeSpentMinutes) || 0,
          notes: form.notes,
        }),
      });
      onRecorded();
    } catch {
      // parent will show toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTopic =
    topicName ||
    topics.find((t) => t.id === Number(form.topicId))?.name ||
    `Topic #${form.topicId}`;
  const canSubmit = form.rating > 0 && form.topicId && !isSubmitting;

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
          maxWidth: 500,
          boxShadow:
            "0 32px 80px rgba(15,23,42,0.2), 0 0 0 1px rgba(59,130,246,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, #3b82f6, #1d4ed8, #60a5fa)",
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
                  d="M9 11l3 3L22 4"
                  stroke="#3b82f6"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Record Review
              </h2>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                Log your study session
              </p>
            </div>
          </div>
          <button onClick={onClose} style={closeBtn}>
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

        <form onSubmit={handleSubmit}>
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Topic select */}
            <Field label="Topic *">
              {topicId ? (
                <div style={{ ...readonlyPill }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      display: "inline-block",
                    }}
                  />
                  {selectedTopic}
                </div>
              ) : (
                <select
                  name="topicId"
                  value={form.topicId}
                  onChange={handleChange}
                  required
                  style={inp}
                  onFocus={(e) => Object.assign(e.target.style, inpF)}
                  onBlur={(e) => Object.assign(e.target.style, inp)}
                >
                  <option value="">Select a topic...</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            {/* Star rating */}
            <Field label="Rating *">
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setForm((p) => ({ ...p, rating: s }))}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                      transition: "transform 0.1s",
                      transform:
                        (hoveredStar || form.rating) >= s
                          ? "scale(1.15)"
                          : "scale(1)",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill={
                        (hoveredStar || form.rating) >= s
                          ? "#3b82f6"
                          : "#e2e8f0"
                      }
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
                {form.rating > 0 && (
                  <span
                    style={{
                      alignSelf: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#3b82f6",
                      marginLeft: 4,
                    }}
                  >
                    {
                      ["", "Poor", "Fair", "Good", "Great", "Excellent"][
                        form.rating
                      ]
                    }
                  </span>
                )}
              </div>
              {!form.rating && (
                <p style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>
                  Please select a rating
                </p>
              )}
            </Field>

            {/* Time spent */}
            <Field label="Time Spent (minutes)">
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  name="timeSpentMinutes"
                  value={form.timeSpentMinutes}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 30"
                  style={{ ...inp, paddingRight: 44 }}
                  onFocus={(e) => Object.assign(e.target.style, inpF)}
                  onBlur={(e) => Object.assign(e.target.style, inp)}
                />
                <span
                  style={{
                    position: "absolute",
                    right: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 11,
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  min
                </span>
              </div>
            </Field>

            {/* Notes */}
            <Field label="Notes">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="What did you study? Any key takeaways..."
                style={{ ...inp, resize: "none", lineHeight: 1.6 }}
                onFocus={(e) => Object.assign(e.target.style, inpF)}
                onBlur={(e) => Object.assign(e.target.style, inp)}
              />
            </Field>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "14px 24px",
              borderTop: "1px solid #f1f5f9",
              background: "#f8fafc",
            }}
          >
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                ...submitBtn,
                opacity: canSubmit ? 1 : 0.6,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 11l3 3L22 4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                  Save Review
                </>
              )}
            </button>
          </div>
        </form>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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
function Spinner() {
  return (
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
  border: "1.5px solid #3b82f6",
  boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
};
const readonlyPill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 14px",
  borderRadius: 10,
  background: "#eff6ff",
  border: "1.5px solid #bfdbfe",
  color: "#1d4ed8",
  fontSize: 14,
  fontWeight: 600,
};
const closeBtn = {
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
};
const cancelBtn = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 11,
  fontSize: 13,
  fontWeight: 600,
  background: "#fff",
  border: "1.5px solid #e2e8f0",
  color: "#475569",
  cursor: "pointer",
};
const submitBtn = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 11,
  fontSize: 13,
  fontWeight: 600,
  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  border: "none",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
};
