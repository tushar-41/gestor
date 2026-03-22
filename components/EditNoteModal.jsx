"use client";

import { useState } from "react";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "ruby",
  "go",
  "rust",
  "php",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
  "bash",
  "json",
  "xml",
  "yaml",
  "markdown",
];

export default function EditNoteModal({ note, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: note.title || "",
    content: note.content || "",
    codeSnippet: note.codeSnippet || "",
    language: note.language || "javascript",
    tags: note.tags || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-[20px] font-semibold text-slate-900">
            Edit Note
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
            {/* Title */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Note Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Note Content
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all resize-none"
              />
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Code Language
              </label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Snippet */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Code Snippet
              </label>
              <textarea
                name="codeSnippet"
                value={form.codeSnippet}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[12px] font-mono transition-all resize-none"
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
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
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
              disabled={isSubmitting || !form.title}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Note"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
