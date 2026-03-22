"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiCall } from "@/lib/auth";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ topics: [], notes: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close on Escape
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setResults({ topics: [], notes: [] });
      return;
    }

    try {
      setIsLoading(true);
      // You can implement actual search API call here
      // For now, we'll leave it as placeholder
      setResults({ topics: [], notes: [] });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-slate-400"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M14 14l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                autoFocus
                placeholder="Search topics, notes, and more..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[16px] text-slate-900 placeholder-slate-400"
              />
              <button
                onClick={onClose}
                className="px-3 py-1 text-[12px] font-medium text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ESC
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm text-slate-500">Searching...</p>
                </div>
              </div>
            ) : searchQuery.trim() &&
              results.topics.length === 0 &&
              results.notes.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-light">
                  No results found for "{searchQuery}"
                </p>
              </div>
            ) : !searchQuery.trim() ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">
                  Start typing to search...
                </p>
              </div>
            ) : (
              <>
                {/* Topics Results */}
                {results.topics.length > 0 && (
                  <div className="p-4 border-b border-slate-200">
                    <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
                      Topics
                    </p>
                    <div className="space-y-2">
                      {results.topics.map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/dashboard/topics`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-slate-400"
                          >
                            <path
                              d="M3 5h14M3 10h14M3 15h14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          <div>
                            <p className="text-[14px] font-medium text-slate-900">
                              {topic.name}
                            </p>
                            <p className="text-[12px] text-slate-500">
                              {topic.category}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Results */}
                {results.notes.length > 0 && (
                  <div className="p-4">
                    <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
                      Notes
                    </p>
                    <div className="space-y-2">
                      {results.notes.map((note) => (
                        <Link
                          key={note.id}
                          href={`/dashboard/notes`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-slate-400"
                          >
                            <path
                              d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          <div>
                            <p className="text-[14px] font-medium text-slate-900">
                              {note.title}
                            </p>
                            <p className="text-[12px] text-slate-500 line-clamp-1">
                              {note.content}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
