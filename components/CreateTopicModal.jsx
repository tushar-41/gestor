"use client";

import { useState } from "react";

export default function CreateTopicModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    difficulty: "BEGINNER",
    learnedDate: new Date().toISOString().split("T")[0],
    parentTopicId: null,
    tags: "",
    confidenceLevel: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "confidenceLevel"
          ? parseInt(value)
          : value === "null"
            ? null
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Don't send parentTopicId if it's empty
      const submitData = {
        name: form.name,
        category: form.category,
        difficulty: form.difficulty,
        learnedDate: form.learnedDate,
        confidenceLevel: form.confidenceLevel,
        tags: form.tags,
      };

      // Only include parentTopicId if it has a value
      if (form.parentTopicId) {
        submitData.parentTopicId = parseInt(form.parentTopicId);
      }

      await onCreate(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-[20px] font-semibold text-slate-900">
            Create New Topic
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto flex-1">
            {/* Topic Name */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Topic Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., React Hooks, TypeScript Basics"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Web Development, Programming"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Difficulty Level *
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            {/* Confidence Level */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Confidence Level (1-5) *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="confidenceLevel"
                  min="1"
                  max="5"
                  value={form.confidenceLevel}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                />
                <span className="text-[18px] font-semibold text-blue-600 w-8 text-center">
                  {form.confidenceLevel}
                </span>
              </div>
            </div>

            {/* Learned Date */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Date Learned
              </label>
              <input
                type="date"
                name="learnedDate"
                value={form.learnedDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., javascript, frontend, react"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
              />
            </div>

            {/* Parent Topic ID */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Parent Topic ID (Optional)
              </label>
              <input
                type="number"
                name="parentTopicId"
                placeholder="Leave empty for root topic"
                value={form.parentTopicId || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-[14px] font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.name || !form.category}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Topic"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
