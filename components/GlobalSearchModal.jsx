"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/auth";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(null);
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
      setResults(null);
      return;
    }

    try {
      setIsLoading(true);
      const result = await apiCall(
        `/api/search?q=${encodeURIComponent(query)}`,
      );
      setResults(result);
    } catch (error) {
      console.error("Search failed:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (item) => {
    onClose();
    if (item.type === "TOPIC") {
      router.push(`/dashboard/topics?id=${item.id}`);
    } else if (item.type === "NOTE") {
      router.push(`/dashboard/notes?id=${item.id}`);
    }
  };

  const getConfidenceBadgeColor = (level) => {
    switch (level) {
      case 4:
      case 5:
        return "bg-green-100 text-green-700";
      case 3:
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      WebD: "bg-blue-100 text-blue-700",
      Devops: "bg-purple-100 text-purple-700",
      Backend: "bg-indigo-100 text-indigo-700",
      Frontend: "bg-pink-100 text-pink-700",
      default: "bg-slate-100 text-slate-700",
    };
    return colors[category] || colors.default;
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
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 lg:pt-20 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 lg:p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
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
                className="flex-1 bg-transparent outline-none text-sm lg:text-base text-slate-900 placeholder-slate-400"
              />
              <button
                onClick={onClose}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ESC
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm text-slate-500">Searching...</p>
                </div>
              </div>
            ) : searchQuery.trim() && results && results.totalResults === 0 ? (
              <div className="p-12 text-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mx-auto mb-3 text-slate-300"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 16l4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-slate-500 font-light">
                  No results found for "{searchQuery}"
                </p>
              </div>
            ) : !searchQuery.trim() ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">
                  Start typing to search topics and notes...
                </p>
              </div>
            ) : results && results.results ? (
              <div className="divide-y divide-slate-200">
                {/* Results Header */}
                <div className="px-4 lg:px-6 py-3 bg-slate-50">
                  <p className="text-xs text-slate-600 font-medium">
                    Found{" "}
                    <span className="font-semibold text-slate-900">
                      {results.totalResults}
                    </span>{" "}
                    result
                    {results.totalResults !== 1 ? "s" : ""} in{" "}
                    <span className="font-semibold">
                      {results.searchTimeMs}ms
                    </span>
                  </p>
                </div>

                {/* Results List */}
                {results.results.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id}-${idx}`}
                    onClick={() => handleResultClick(item)}
                    className="w-full text-left px-4 lg:px-6 py-4 hover:bg-slate-50 transition-colors focus:outline-none focus:bg-blue-50"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="shrink-0 mt-1">
                        {item.type === "TOPIC" ? (
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M3 5h14M3 10h14M3 15h14"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="text-sm lg:text-base font-semibold text-slate-900 mb-1 truncate">
                          {item.title}
                        </h3>

                        {/* Snippet */}
                        <p className="text-xs lg:text-sm text-slate-600 mb-2 line-clamp-2">
                          {item.snippet}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center flex-wrap gap-2">
                          {/* Category */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryBadgeColor(item.category)}`}
                          >
                            {item.category}
                          </span>

                          {/* Confidence */}
                          {item.confidenceLevel !== null && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConfidenceBadgeColor(item.confidenceLevel)}`}
                            >
                              {item.confidenceLevel}/5
                            </span>
                          )}

                          {/* Type Badge */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              item.type === "TOPIC"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-indigo-50 text-indigo-700"
                            }`}
                          >
                            {item.type === "TOPIC" ? "Topic" : "Note"}
                          </span>

                          {/* Learned/Reviewed Date */}
                          {item.learnedDate && (
                            <span className="text-xs text-slate-500">
                              Learned:{" "}
                              {new Date(item.learnedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-2 flex items-center flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-xs text-slate-500 ml-1">
                                +{item.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Relevance Score */}
                        {item.relevanceScore !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 transition-all"
                                style={{
                                  width: `${item.relevanceScore * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">
                              {Math.round(item.relevanceScore * 100)}% match
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0 mt-1">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="text-slate-300 group-hover:text-slate-400 transition-colors"
                        >
                          <path
                            d="M7 8L13 14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
