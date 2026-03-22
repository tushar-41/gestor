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

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-[14px] text-slate-500 font-light">
          Welcome back to your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Streak Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Current Streak
              </p>
              <h3 className="text-[32px] font-semibold text-slate-900">
                {streak?.currentStreak || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 10H23L17 15L19 23L12 18L5 23L7 15L1 10H9L12 2Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] text-slate-400 font-light">
            Days of consistent learning
          </p>
        </div>

        {/* Longest Streak Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Longest Streak
              </p>
              <h3 className="text-[32px] font-semibold text-slate-900">
                {streak?.longestStreak || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 10H23L17 15L19 23L12 18L5 23L7 15L1 10H9L12 2Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] text-slate-400 font-light">
            Your best streak record
          </p>
        </div>

        {/* Topics Learned Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Topics Learned
              </p>
              <h3 className="text-[32px] font-semibold text-slate-900">
                {stats?.topicsLearned || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] text-slate-400 font-light">
            Topics completed
          </p>
        </div>

        {/* Total Hours Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Total Hours
              </p>
              <h3 className="text-[32px] font-semibold text-slate-900">
                {stats?.totalHours || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] text-slate-400 font-light">
            Learning time invested
          </p>
        </div>
      </div>

      {/* Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-[18px] font-semibold text-slate-900 mb-6">
            Learning Progress
          </h2>
          <div className="space-y-4">
            {[
              { name: "Completed Reviews", value: stats?.completedReviews || 0, max: 100, color: "bg-blue-600" },
              { name: "Active Topics", value: stats?.activeTopics || 0, max: 50, color: "bg-green-600" },
              { name: "Pending Tasks", value: stats?.pendingTasks || 0, max: 100, color: "bg-orange-600" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-medium text-slate-600">{item.name}</p>
                  <p className="text-[13px] font-semibold text-slate-800">
                    {item.value}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-300`}
                    style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-[18px] font-semibold text-slate-900 mb-6">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <p className="text-[13px] text-slate-600">This Week</p>
              <p className="text-[18px] font-semibold text-blue-600">
                {stats?.weeklyHours || 0}h
              </p>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <p className="text-[13px] text-slate-600">This Month</p>
              <p className="text-[18px] font-semibold text-blue-600">
                {stats?.monthlyHours || 0}h
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-slate-600">Streak Status</p>
              <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[12px] font-semibold">
                <span>🔥 Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
