"use client";

import { useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import TopicDetailsModal from "./TopicDetailsModal";
import EditTopicModal from "./EditTopicModal";

export default function TopicCard({ topic, onDelete, onRefresh }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [childTopics, setChildTopics] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-50 text-green-700";
      case "INTERMEDIATE":
        return "bg-blue-50 text-blue-700";
      case "ADVANCED":
        return "bg-orange-50 text-orange-700";
      case "EXPERT":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const getConfidenceColor = (level) => {
    if (level >= 8) return "text-green-600";
    if (level >= 5) return "text-blue-600";
    return "text-orange-600";
  };

  const handleViewDetails = async () => {
    try {
      setLoadingChildren(true);
      const children = await apiCall(`/api/topics/${topic.id}/children`);
      if (children) setChildTopics(children);
      setShowDetails(true);
    } catch (error) {
      toast.error("Failed to load topic details");
      console.error(error);
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleDelete = () => {
    onDelete(topic.id);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await apiCall(`/api/topics/${topic.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      toast.success("Topic updated successfully!");
      setShowEdit(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update topic");
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {topic.name}
            </h3>
            <p className="text-[12px] text-slate-500 mt-1">{topic.category}</p>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowEdit(true)}
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
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
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

        {/* Difficulty Badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${getDifficultyColor(
              topic.difficulty
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {topic.difficulty}
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-4 pb-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-slate-600">Confidence Level</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    topic.confidenceLevel >= 8
                      ? "bg-green-600"
                      : topic.confidenceLevel >= 5
                        ? "bg-blue-600"
                        : "bg-orange-600"
                  } transition-all`}
                  style={{
                    width: `${(topic.confidenceLevel / 10) * 100}%`,
                  }}
                />
              </div>
              <span className={`font-semibold w-5 text-right ${getConfidenceColor(topic.confidenceLevel)}`}>
                {topic.confidenceLevel}/10
              </span>
            </div>
          </div>

          {topic.tags && (
            <div className="flex flex-wrap gap-1.5">
              {topic.tags.split(",").map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 rounded-md"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {topic.learnedDate && (
            <p className="text-[12px] text-slate-500">
              📅 Learned on {new Date(topic.learnedDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewDetails}
          disabled={loadingChildren}
          className="w-full py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-[13px] font-medium transition-colors disabled:opacity-50"
        >
          {loadingChildren ? "Loading..." : "View Details"}
        </button>
      </div>

      {/* Modals */}
      {showDetails && (
        <TopicDetailsModal
          topic={topic}
          childTopics={childTopics}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showEdit && (
        <EditTopicModal
          topic={topic}
          onClose={() => setShowEdit(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
