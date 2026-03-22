"use client";

import { useState } from "react";

export default function NoteCard({ note, onEdit, onDelete, onView }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setIsDeleting(true);
    try {
      await onDelete(note.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getLanguageBadgeColor = (language) => {
    const colors = {
      javascript: "bg-yellow-50 text-yellow-700",
      typescript: "bg-blue-50 text-blue-700",
      python: "bg-green-50 text-green-700",
      java: "bg-red-50 text-red-700",
      cpp: "bg-purple-50 text-purple-700",
      csharp: "bg-purple-50 text-purple-700",
      ruby: "bg-red-50 text-red-700",
      go: "bg-cyan-50 text-cyan-700",
      rust: "bg-orange-50 text-orange-700",
      php: "bg-indigo-50 text-indigo-700",
      html: "bg-orange-50 text-orange-700",
      css: "bg-blue-50 text-blue-700",
      sql: "bg-cyan-50 text-cyan-700",
      bash: "bg-slate-50 text-slate-700",
    };
    return colors[language] || "bg-slate-50 text-slate-700";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-[16px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
            {note.title}
          </h3>
          {note.language && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${getLanguageBadgeColor(
                note.language
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
              {note.language.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17.25V21h3.75L17.81 9.94M21 7.04a2.828 2.828 0 00-4-4L9 11.04"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M15 7V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-[13px] text-slate-600 line-clamp-2 mb-3">
        {note.content || "No content"}
      </p>

      {/* Code Snippet Preview */}
      {note.codeSnippet && (
        <div className="mb-3 p-3 bg-slate-900 rounded-lg overflow-hidden">
          <p className="text-[11px] text-slate-300 font-mono line-clamp-2">
            {note.codeSnippet}
          </p>
        </div>
      )}

      {/* Tags */}
      {note.tags && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {note.tags.split(",").map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 rounded-md"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onView(note)}
        className="w-full py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-[13px] font-medium transition-colors"
      >
        View Details
      </button>
    </div>
  );
}
