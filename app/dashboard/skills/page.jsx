"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import CreateSkillFamilyModal from "@/components/CreateSkillFamilyModal";
import SkillEvolutionModal from "@/components/SkillEvolutionModal";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function SkillsPage() {
  const [skillFamilies, setSkillFamilies] = useState([]);
  const [regressionRisks, setRegressionRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRisks, setIsLoadingRisks] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [expandedFamilies, setExpandedFamilies] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState(null);
  const [isDeletingFamily, setIsDeletingFamily] = useState(false);

  // Fetch all skill families
  const fetchSkillFamilies = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall(
        "/api/skill-evolution/families?includeEvolutions=true",
      );
      if (Array.isArray(response)) {
        setSkillFamilies(response);
      } else {
        toast.error("Failed to load skill families");
      }
    } catch (error) {
      console.error("Error fetching skill families:", error);
      toast.error(error.message || "Failed to load skill families");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch regression risks
  const fetchRegressionRisks = async () => {
    try {
      setIsLoadingRisks(true);
      const response = await apiCall(
        "/api/skill-evolution/regression-check?daysThreshold=30",
      );
      if (Array.isArray(response)) {
        setRegressionRisks(response);
      }
    } catch (error) {
      console.error("Error fetching regression risks:", error);
    } finally {
      setIsLoadingRisks(false);
    }
  };

  useEffect(() => {
    fetchSkillFamilies();
    fetchRegressionRisks();
  }, []);

  const handleCreateFamily = async (familyData) => {
    try {
      const response = await apiCall("/api/skill-evolution/families", {
        method: "POST",
        body: JSON.stringify(familyData),
      });
      if (response) {
        setSkillFamilies([...skillFamilies, response]);
        toast.success("Skill family created successfully");
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Error creating skill family:", error);
      toast.error(error.message || "Failed to create skill family");
    }
  };

  const handleDeleteFamily = (familyId) => {
    setFamilyToDelete(familyId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteFamily = async () => {
    if (!familyToDelete) return;

    setIsDeletingFamily(true);
    try {
      await apiCall(`/api/skill-evolution/families/${familyToDelete}`, {
        method: "DELETE",
      });
      setSkillFamilies(skillFamilies.filter((f) => f.id !== familyToDelete));
      toast.success("Skill family deleted successfully");
      setShowDeleteConfirm(false);
      setFamilyToDelete(null);
    } catch (error) {
      console.error("Error deleting skill family:", error);
      toast.error(error.message || "Failed to delete skill family");
    } finally {
      setIsDeletingFamily(false);
    }
  };

  const cancelDeleteFamily = () => {
    setShowDeleteConfirm(false);
    setFamilyToDelete(null);
  };

  const handleAddEvolution = (familyId) => {
    setSelectedFamilyId(familyId);
    setShowEvolutionModal(true);
  };

  const handleEvolutionCreated = () => {
    fetchSkillFamilies();
    setShowEvolutionModal(false);
  };

  const toggleExpandFamily = (familyId) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [familyId]: !prev[familyId],
    }));
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "bg-red-50 border-red-200 text-red-700";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "low":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading skill families...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-[32px] font-semibold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Skill Evolution
          </h1>
          <p className="text-[14px] text-slate-500 font-light mt-1">
            Track your skill progression through different levels and complexity
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white text-[14px] font-semibold transition-all hover:scale-105 active:scale-99"
          style={{
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          New Skill Family
        </button>
      </div>

      {/* Regression Risk Alert */}
      {!isLoadingRisks && regressionRisks.length > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-red-600 mt-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">
                Skills at Risk
              </h3>
              <p className="text-[13px] text-red-800 mb-3">
                You haven't reviewed these skills recently. Practice them to
                avoid regression:
              </p>
              <div className="space-y-2">
                {regressionRisks.map((risk) => (
                  <div
                    key={risk.topicId}
                    className={`p-3 rounded-lg border text-[12px] ${getRiskLevelColor(risk.riskLevel)}`}
                  >
                    <div className="font-semibold">{risk.familyName}</div>
                    <div className="text-[12px] opacity-90">
                      {risk.topicName} • Level {risk.level} •{" "}
                      {risk.daysSinceReview} days since review
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Families */}
      {skillFamilies.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <div
            className="flex items-center justify-center rounded-2xl mx-auto mb-4"
            style={{ width: 56, height: 56, background: "#eef2ff" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "#6366f1" }}
            >
              <path
                d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12C8 10.3431 9.34315 9 11 9C12.6569 9 14 10.3431 14 12C14 13.6569 12.6569 15 11 15C9.34315 15 8 13.6569 8 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-slate-700 mb-1">
            No skill families yet
          </p>
          <p className="text-[13px] text-slate-400 mb-5">
            Create your first skill family to start tracking your learning
            journey
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-linear-to-r from-blue-500 to-blue-600 transition-all hover:scale-105 active:scale-99"
            style={{
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M4 10h12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            Create First Skill Family
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {skillFamilies.map((family) => (
            <div
              key={family.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Family Header */}
              <div
                className="p-6 flex items-start justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleExpandFamily(family.id)}
              >
                <div className="flex-1">
                  <h3 className="text-[18px] font-semibold text-slate-900 mb-1">
                    {family.name}
                  </h3>
                  {family.description && (
                    <p className="text-[13px] text-slate-600 mb-2">
                      {family.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-[12px]">
                    {family.category && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                        {family.category}
                      </span>
                    )}
                    <span className="text-slate-500">
                      {family.totalLevels || 0} levels
                    </span>
                    <span className="text-slate-500">
                      {(family.evolutions || []).length} evolutions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddEvolution(family.id);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    title="Add evolution"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFamily(family.id);
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                    title="Delete family"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 5h12M7 9v6M10 9v6M13 9v6M5 5l1 12a1 1 0 001 1h6a1 1 0 001-1l1-12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    className={`text-slate-600 transition-transform ${
                      expandedFamilies[family.id] ? "rotate-180" : ""
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Evolutions List */}
              {expandedFamilies[family.id] && (
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                  {(family.evolutions || []).length === 0 ? (
                    <p className="text-[13px] text-slate-500 text-center py-4">
                      No evolutions yet. Click the + button to add one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {family.evolutions.map((evolution) => (
                        <div
                          key={evolution.id}
                          className="bg-white border border-slate-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-[14px] font-semibold text-slate-900">
                                Level {evolution.level} • {evolution.topicName}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                                  {evolution.automationLevel}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Complexity: {evolution.complexityScore}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSkillFamilyModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateFamily}
        />
      )}

      {showEvolutionModal && selectedFamilyId && (
        <SkillEvolutionModal
          familyId={selectedFamilyId}
          onClose={() => setShowEvolutionModal(false)}
          onSuccess={handleEvolutionCreated}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmationModal
          title="Delete Skill Family?"
          description="This action cannot be undone. All evolutions and data associated with this skill family will be permanently deleted."
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={isDeletingFamily}
          onConfirm={confirmDeleteFamily}
          onCancel={cancelDeleteFamily}
        />
      )}
    </div>
  );
}
