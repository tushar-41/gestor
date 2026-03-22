"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";

export default function TopicSelector({ selectedTopic, onTopicChange, isLoading }) {
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);
        const response = await apiCall("/api/topics");
        if (response && Array.isArray(response)) {
          setTopics(response);
        }
      } catch (error) {
        console.error("Failed to load topics:", error);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="mb-8">
      <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
        Select a Topic to Manage Notes
      </label>
      <select
        value={selectedTopic || ""}
        onChange={(e) => onTopicChange(e.target.value ? parseInt(e.target.value) : null)}
        disabled={topicsLoading || isLoading}
        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">
          {topicsLoading ? "Loading topics..." : "Choose a topic..."}
        </option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name} ({topic.category})
          </option>
        ))}
      </select>

      {topics.length === 0 && !topicsLoading && (
        <p className="text-[12px] text-red-600 mt-2">
          📚 No topics found. Create a topic first to add notes!
        </p>
      )}
    </div>
  );
}
