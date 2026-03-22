"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiCall(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response && Array.isArray(response)) {
        setResults(response);
      }
    } catch (error) {
      toast.error("Search failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-8">
      <h1
        className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Global Search
      </h1>
      <p className="text-[14px] text-slate-500 font-light mb-8">
        Search across all your topics, notes, and projects
      </p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, notes, projects..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all active:scale-[0.98]"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500">
            {searchQuery ? "No results found" : "Start searching to find items"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-slate-900 mb-1">
                    {result.title || result.name}
                  </h3>
                  <p className="text-[13px] text-slate-600 mb-2">
                    Type: <span className="font-semibold">{result.type}</span>
                  </p>
                  <p className="text-[13px] text-slate-500 line-clamp-2">
                    {result.description || result.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
