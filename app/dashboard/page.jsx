"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [dashboardStats, streakData] = await Promise.all([
          apiCall("/api/dashboard"),
          apiCall("/api/dashboard/streak"),
        ]);

        if (dashboardStats) setStats(dashboardStats);
        if (streakData) setStreak(streakData);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const topicHealth = [
    { label: "Strong", value: stats?.strongTopics || 0, color: "bg-green-600" },
    {
      label: "Moderate",
      value: stats?.moderateTopics || 0,
      color: "bg-yellow-600",
    },
    { label: "Weak", value: stats?.weakTopics || 0, color: "bg-red-600" },
  ];

  const totalHealthTopics = topicHealth.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // Convert minutes to hours
  const totalHours =
    Math.round(((stats?.totalTimeSpentMinutes || 0) / 60) * 10) / 10;

  // Get last 6 months of progress
  const recentMonths = (stats?.monthlyProgress || []).slice(-6);

  return (
    <div className="w-full p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 font-light">
          Welcome back to your learning journey
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Current Streak Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Current Streak
              </p>
              <h3 className="text-3xl lg:text-4xl font-semibold text-slate-900">
                {streak?.currentStreak || 0}
              </h3>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15 10H23L17 15L19 23L12 18L5 23L7 15L1 10H9L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400">Days of consistent learning</p>
        </div>

        {/* Total Topics Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Topics Learned
              </p>
              <h3 className="text-3xl lg:text-4xl font-semibold text-slate-900">
                {stats?.totalTopics || 0}
              </h3>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13L9 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400">Total topics in path</p>
        </div>

        {/* Total Hours Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Total Hours
              </p>
              <h3 className="text-3xl lg:text-4xl font-semibold text-slate-900">
                {totalHours}h
              </h3>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400">Learning time invested</p>
        </div>

        {/* Confidence Score Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Avg Confidence
              </p>
              <h3 className="text-3xl lg:text-4xl font-semibold text-slate-900">
                {stats?.averageConfidence || 0}/5
              </h3>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15 10H23L17 15L19 23L12 18L5 23L7 15L1 10H9L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400">Knowledge level</p>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Notes Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Notes
            </p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {stats?.totalNotes || 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Created</p>
        </div>

        {/* Projects Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Projects
            </p>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="12"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {stats?.totalProjects || 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Completed</p>
        </div>

        {/* Reviews Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reviews
            </p>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.5 1.5L13 6h5l-4 3 1.5 4.5L10 11l-4 2.5 1.5-4.5-4-3h5l2.5-4.5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {stats?.totalReviews || 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">This month</p>
        </div>

        {/* Learning Path Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Path Length
            </p>
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-lime-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12l6-6v3h12v6H9v3l-6-6z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {stats?.learningPathLength || 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Topics</p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Health */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Topic Health
          </h2>
          <div className="space-y-4">
            {topicHealth.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-600">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.value}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-300`}
                    style={{
                      width:
                        totalHealthTopics > 0
                          ? `${(item.value / totalHealthTopics) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics by Category */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            By Category
          </h2>
          <div className="space-y-3">
            {(stats?.topicsByCategory || []).length > 0 ? (
              stats.topicsByCategory.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {cat.category}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Confidence: {cat.averageConfidence}/5
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                    {cat.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No categories yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Quick Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <p className="text-sm text-slate-600">Due Today</p>
              <p className="text-lg font-semibold text-blue-600">
                {stats?.topicsDueToday || 0}
              </p>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <p className="text-sm text-slate-600">Overdue</p>
              <p className="text-lg font-semibold text-red-600">
                {stats?.topicsOverdue || 0}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">At Risk</p>
              <p className="text-lg font-semibold text-orange-600">
                {stats?.atRiskTopics || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Progress Chart */}
      {recentMonths.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Progress Overview
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4 min-w-max lg:min-w-0">
              {recentMonths.map((month, idx) => (
                <div key={idx} className="flex-1 min-w-[120px] text-center">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-end justify-center gap-1 h-24 bg-slate-50 p-3 rounded-lg">
                      <div
                        className="w-6 bg-blue-600 rounded-t transition-all"
                        style={{
                          height: `${Math.min((month.topicsLearned || 0) * 12, 100)}%`,
                        }}
                        title={`Topics: ${month.topicsLearned}`}
                      />
                      <div
                        className="w-6 bg-green-600 rounded-t transition-all"
                        style={{
                          height: `${Math.min((month.reviewsCompleted || 0) * 12, 100)}%`,
                        }}
                        title={`Reviews: ${month.reviewsCompleted}`}
                      />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-600 truncate">
                    {month.monthName.split(" ")[0]}
                  </p>
                  <p className="text-xs text-slate-400">{month.month}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded" />
                <span className="text-xs text-slate-600">Topics Learned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded" />
                <span className="text-xs text-slate-600">
                  Reviews Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journey Info */}
      {stats?.journeyStartDate && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 3v14M3 10h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Your Learning Journey
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Started on{" "}
                <span className="font-medium">
                  {new Date(stats.journeyStartDate).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-slate-500">
                You're on track! Keep learning and reviewing to maintain your
                streak.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
