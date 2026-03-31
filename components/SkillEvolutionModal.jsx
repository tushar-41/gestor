"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function SkillEvolutionModal({ familyId, onClose, onSuccess }) {
  const [topics, setTopics] = useState([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    topicId: "",
    level: "1",
    complexityScore: "5",
    automationLevel: "MANUAL",
    pros: "",
    cons: "",
    useCases: "",
    codeComparison: "",
  });

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoadingTopics(true);
        const response = await apiCall("/api/topics");
        if (Array.isArray(response)) {
          setTopics(response);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("Failed to load topics");
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topicId) {
      toast.error("Please select a topic");
      return;
    }

    const level = parseInt(formData.level);
    if (level < 1 || level > 100) {
      toast.error("Level must be between 1 and 100");
      return;
    }

    const complexity = parseInt(formData.complexityScore);
    if (complexity < 1 || complexity > 10) {
      toast.error("Complexity score must be between 1 and 10");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiCall("/api/skill-evolution", {
        method: "POST",
        body: JSON.stringify({
          skillFamilyId: familyId,
          topicId: parseInt(formData.topicId),
          level,
          complexityScore: complexity,
          automationLevel: formData.automationLevel,
          pros: formData.pros,
          cons: formData.cons,
          useCases: formData.useCases,
          codeComparison: formData.codeComparison,
        }),
      });

      if (response) {
        toast.success("Skill evolution created successfully");
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating skill evolution:", error);
      toast.error(error.message || "Failed to create skill evolution");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
            <h2 className="text-[18px] font-semibold text-slate-900">
              Add Skill Evolution
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Topic Selection */}
            <div>
              <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                Topic *
              </label>
              {isLoadingTopics ? (
                <div className="px-3 py-2 border border-slate-300 rounded-lg text-[14px] text-slate-500">
                  Loading topics...
                </div>
              ) : (
                <select
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title || topic.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                  Level *
                </label>
                <input
                  type="number"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-[11px] text-slate-500 mt-1">1-100</p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                  Complexity Score *
                </label>
                <input
                  type="number"
                  name="complexityScore"
                  value={formData.complexityScore}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-[11px] text-slate-500 mt-1">1-10</p>
              </div>
            </div>

            {/* Automation Level */}
            <div>
              <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                Automation Level *
              </label>
              <select
                name="automationLevel"
                value={formData.automationLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MANUAL">Manual</option>
                <option value="SEMI_AUTO">Semi-Automated</option>
                <option value="FULLY_AUTO">Fully Automated</option>
              </select>
            </div>

            {/* Pros */}
            <div>
              <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                Pros
              </label>
              <textarea
                name="pros"
                value={formData.pros}
                onChange={handleChange}
                placeholder="What are the advantages..."
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Cons */}
            <div>
              <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                Cons
              </label>
              <textarea
                name="cons"
                value={formData.cons}
                onChange={handleChange}
                placeholder="What are the disadvantages..."
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Use Cases */}
            <div>
              <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                Use Cases
              </label>
              <textarea
                name="useCases"
                value={formData.useCases}
                onChange={handleChange}
                placeholder="When should this be used..."
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Code Comparison */}
            <div>
              <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                Code Comparison
              </label>
              <textarea
                name="codeComparison"
                value={formData.codeComparison}
                onChange={handleChange}
                placeholder="Compare code examples..."
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[14px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingTopics}
                className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-[14px] font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Add Evolution"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
