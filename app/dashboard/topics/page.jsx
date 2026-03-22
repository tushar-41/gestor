"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import CreateTopicModal from "@/components/CreateTopicModal";
import TopicCard from "@/components/TopicCard";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [rootTopics, setRootTopics] = useState([]);
  const [atRiskTopics, setAtRiskTopics] = useState([]);
  const [topicCount, setTopicCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, root, atRisk

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const [allTopics, roots, atRisk, count] = await Promise.all([
        apiCall("/api/topics"),
        apiCall("/api/topics/root"),
        apiCall("/api/topics/at-risk"),
        apiCall("/api/topics/count"),
      ]);

      if (allTopics) setTopics(allTopics);
      if (roots) setRootTopics(roots);
      if (atRisk) setAtRiskTopics(atRisk);
      if (count) setTopicCount(count.count || count);
    } catch (error) {
      toast.error("Failed to load topics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async (topicData) => {
    try {
      console.log("Creating topic with data:", topicData);
      console.log("Request body:", JSON.stringify(topicData, null, 2));

      const response = await apiCall("/api/topics", {
        method: "POST",
        body: JSON.stringify(topicData),
      });

      console.log("Topic creation response:", response);

      if (response) {
        toast.success("Topic created successfully!");
        setShowCreateModal(false);
        await fetchTopics();
      } else {
        toast.error("Failed to create topic - No response from server");
      }
    } catch (error) {
      console.error("Topic creation error:", error);
      console.log("Error details:", error.message);
      toast.error(error.message || "Failed to create topic");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      await apiCall(`/api/topics/${topicId}`, {
        method: "DELETE",
      });

      toast.success("Topic deleted successfully!");
      fetchTopics();
    } catch (error) {
      toast.error("Failed to delete topic");
      console.error(error);
    }
  };

  const displayedTopics =
    activeTab === "root"
      ? rootTopics
      : activeTab === "atRisk"
        ? atRiskTopics
        : topics;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Learning Topics
          </h1>
          <p className="text-[14px] text-slate-500 font-light">
            Manage your learning topics and track your progress
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Create Topic
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Total Topics
          </p>
          <h3 className="text-[32px] font-semibold text-slate-900">
            {topicCount}
          </h3>
          <p className="text-[12px] text-slate-400 font-light mt-2">
            Topics in your collection
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Root Topics
          </p>
          <h3 className="text-[32px] font-semibold text-slate-900">
            {rootTopics.length}
          </h3>
          <p className="text-[12px] text-slate-400 font-light mt-2">
            Parent-level topics
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            At-Risk Topics
          </p>
          <h3 className="text-[32px] font-semibold text-orange-600">
            {atRiskTopics.length}
          </h3>
          <p className="text-[12px] text-slate-400 font-light mt-2">
            Need review attention
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          All Topics ({topics.length})
        </button>
        <button
          onClick={() => setActiveTab("root")}
          className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === "root"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Root Topics ({rootTopics.length})
        </button>
        <button
          onClick={() => setActiveTab("atRisk")}
          className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === "atRisk"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          At-Risk ({atRiskTopics.length})
        </button>
      </div>

      {/* Topics Grid */}
      {displayedTopics.length === 0 ? (
        <div className="text-center py-12">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-4 text-slate-300"
          >
            <path
              d="M3 5h18M3 10h18M3 15h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-slate-500 font-light mb-4">
            {activeTab === "root"
              ? "No root topics yet"
              : activeTab === "atRisk"
                ? "All topics are in good shape!"
                : "No topics created yet"}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Create your first topic
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onDelete={handleDeleteTopic}
              onRefresh={fetchTopics}
            />
          ))}
        </div>
      )}

      {/* Create Topic Modal */}
      {showCreateModal && (
        <CreateTopicModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTopic}
        />
      )}
    </div>
  );
}
