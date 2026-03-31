"use client";

import { useEffect, useState, useMemo } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import RecordReviewModal from "@/components/RecordReviewModal";
import ReviewHistoryModal from "@/components/ReviewHistoryModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ─── helpers ─────────────────────────────────────────────── */
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s <= rating ? "#3b82f6" : "#e2e8f0"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── main page ───────────────────────────────────────────── */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [dueTopics, setDueTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordOpen, setRecordOpen] = useState(false);
  const [historyTopicId, setHistoryTopicId] = useState(null);
  const [historyTopicName, setHistoryTopicName] = useState("");

  // date range filter
  const today = new Date().toISOString().split("T")[0];
  const thirtyAgo = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .split("T")[0];
  const [startDate, setStartDate] = useState(thirtyAgo);
  const [endDate, setEndDate] = useState(today);
  const [rangeReviews, setRangeReviews] = useState([]);
  const [rangeLoading, setRangeLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [rev, st, due, top] = await Promise.all([
        apiCall("/api/reviews"),
        apiCall("/api/reviews/stats"),
        apiCall("/api/reviews/due"),
        apiCall("/api/topics"),
      ]);
      setReviews(Array.isArray(rev) ? rev : []);
      setStats(st || null);
      setDueTopics(Array.isArray(due) ? due : []);
      setTopics(Array.isArray(top) ? top : top?.data || []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRange = async () => {
    if (!startDate || !endDate) return;
    setRangeLoading(true);
    try {
      const data = await apiCall(
        `/api/reviews/range?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`,
      );
      setRangeReviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch date range");
    } finally {
      setRangeLoading(false);
    }
  };

  const handleReviewRecorded = () => {
    setRecordOpen(false);
    loadAll();
    toast.success("Review recorded!");
  };

  const dueTopicObjects = topics.filter((t) => dueTopics.includes(t.id));

  // ── At-risk computation ───────────────────────────────────────
  // Groups reviews by topicId, then scores each topic for risk signals:
  //   OVERDUE  – nextReviewDate is in the past (most urgent)
  //   LOW_RATING – latest review rating <= 2
  //   STALE    – last reviewed > 14 days ago with no upcoming review date
  //   NEVER    – topic exists in topics list but has no review at all
  const atRiskTopics = (() => {
    const todayMs = Date.now();
    const STALE_THRESHOLD_DAYS = 14;

    // Build a map: topicId → { latestReview, allReviews }
    const byTopic = {};
    reviews.forEach((r) => {
      if (!byTopic[r.topicId])
        byTopic[r.topicId] = { latestReview: r, allReviews: [] };
      byTopic[r.topicId].allReviews.push(r);
      // keep the most recent
      if (
        new Date(r.reviewedAt) >
        new Date(byTopic[r.topicId].latestReview.reviewedAt)
      ) {
        byTopic[r.topicId].latestReview = r;
      }
    });

    const atRisk = [];

    // Check reviewed topics for risk signals
    Object.entries(byTopic).forEach(
      ([topicIdStr, { latestReview, allReviews }]) => {
        const topicId = Number(topicIdStr);
        const topic = topics.find((t) => t.id === topicId) || {
          id: topicId,
          name: latestReview.topicName,
        };
        const reasons = [];
        let severity = 0; // higher = more urgent

        // Signal 1: Overdue (nextReviewDate is in the past)
        if (latestReview.nextReviewDate) {
          const nextMs = new Date(latestReview.nextReviewDate).getTime();
          const overdueDays = Math.floor((todayMs - nextMs) / 86400000);
          if (overdueDays > 0) {
            reasons.push({
              type: "OVERDUE",
              label: `${overdueDays}d overdue`,
              days: overdueDays,
            });
            severity += 30 + overdueDays;
          }
        }

        // Signal 2: Low rating on latest review
        if (latestReview.rating <= 2) {
          reasons.push({
            type: "LOW_RATING",
            label: `Last rated ${latestReview.rating}/5`,
            rating: latestReview.rating,
          });
          severity += 20;
        }

        // Signal 3: Stale — last reviewed > STALE_THRESHOLD_DAYS ago
        const daysSinceReview = Math.floor(
          (todayMs - new Date(latestReview.reviewedAt).getTime()) / 86400000,
        );
        if (daysSinceReview > STALE_THRESHOLD_DAYS) {
          reasons.push({
            type: "STALE",
            label: `${daysSinceReview}d since last review`,
            days: daysSinceReview,
          });
          severity += 10 + daysSinceReview;
        }

        if (reasons.length > 0) {
          atRisk.push({
            topic,
            latestReview,
            reasons,
            severity,
            daysSinceReview,
          });
        }
      },
    );

    // Signal 4: Topics that have never been reviewed
    topics.forEach((t) => {
      if (!byTopic[t.id]) {
        atRisk.push({
          topic: t,
          latestReview: null,
          reasons: [{ type: "NEVER", label: "Never reviewed" }],
          severity: 5,
          daysSinceReview: Infinity,
        });
      }
    });

    // Sort by severity descending (most urgent first)
    return atRisk.sort((a, b) => b.severity - a.severity);
  })();

  // ── Chart data derivations ────────────────────────────────────

  // 1. Reviews per day over last 30 days
  const reviewsOverTime = useMemo(() => {
    const buckets = {};
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      buckets[key] = 0;
    }
    reviews.forEach((r) => {
      const key = new Date(r.reviewedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (key in buckets) buckets[key]++;
    });
    // Only show every 5th label to avoid clutter
    return Object.entries(buckets).map(([date, count], i) => ({
      date: i % 5 === 0 ? date : "",
      fullDate: date,
      count,
    }));
  }, [reviews]);

  // 2. Total time spent per topic (top 8)
  const timePerTopic = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      if (!map[r.topicName]) map[r.topicName] = 0;
      map[r.topicName] += r.timeSpentMinutes || 0;
    });
    return Object.entries(map)
      .map(([name, minutes]) => ({
        name: name.length > 10 ? name.slice(0, 10) + "…" : name,
        fullName: name,
        minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 8);
  }, [reviews]);

  // 3. Rating distribution (1–5 stars)
  const ratingDist = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating]++;
    });
    return [1, 2, 3, 4, 5].map((star) => ({
      star,
      label: "★".repeat(star),
      count: counts[star],
    }));
  }, [reviews]);

  // 4. Average rating per topic (top 7)
  const avgRatingPerTopic = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      if (!map[r.topicName]) map[r.topicName] = { sum: 0, count: 0 };
      map[r.topicName].sum += r.rating;
      map[r.topicName].count++;
    });
    return Object.entries(map)
      .map(([name, { sum, count }]) => ({
        name: name.length > 12 ? name.slice(0, 12) + "…" : name,
        avg: parseFloat((sum / count).toFixed(2)),
      }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 7);
  }, [reviews]);

  if (isLoading) return <PageLoader />;

  return (
    <div
      style={{
        width: "100%",
        padding: "32px 32px 56px",
        background: "#f8fafc",
        minHeight: "100%",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.6px",
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: 4,
            }}
          >
            Reviews
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 400 }}>
            Track your topic review sessions and spaced repetition progress
          </p>
        </div>
        <button onClick={() => setRecordOpen(true)} style={primaryBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          Record Review
        </button>
      </div>

      {/* ── Stats overview numbers ── */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Total Reviews"
            value={stats.totalReviews}
            icon={reviewIcon}
          />
          <StatCard
            label="Last 7 Days"
            value={stats.reviewsLast7Days}
            icon={calIcon}
          />
          <StatCard
            label="Last 30 Days"
            value={stats.reviewsLast30Days}
            icon={trendIcon}
          />
          <StatCard
            label="Topics Reviewed"
            value={stats.topicsReviewedCount}
            icon={topicIcon}
          />
          <StatCard
            label="Total Time"
            value={`${stats.totalTimeSpentMinutes}m`}
            icon={clockIcon}
          />
          <StatCard
            label="Avg / Review"
            value={`${stats.averageTimePerReview}m`}
            icon={avgIcon}
          />
        </div>
      )}

      {/* ── Charts ── */}
      {reviews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {/* Chart 1 — Reviews over time (area) */}
          <ChartCard
            title="Reviews Over Time"
            sub="Daily session count (last 30 days)"
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={reviewsOverTime}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#1e293b", fontWeight: 700 }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#blueGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#1d4ed8" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2 — Time spent per topic (bar) */}
          <ChartCard title="Time Spent per Topic" sub="Total minutes by topic">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={timePerTopic}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                barSize={22}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#1e293b", fontWeight: 700 }}
                  itemStyle={{ color: "#3b82f6" }}
                  formatter={(v) => [`${v}m`, "Time"]}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                  {timePerTopic.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? "#3b82f6" : "#60a5fa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 3 — Rating distribution (bar) */}
          <ChartCard
            title="Rating Distribution"
            sub="How often each star rating appears"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={ratingDist}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#1e293b", fontWeight: 700 }}
                  itemStyle={{ color: "#3b82f6" }}
                  formatter={(v) => [v, "Reviews"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ratingDist.map((entry) => (
                    <Cell
                      key={entry.label}
                      fill={
                        entry.count > 0
                          ? `hsl(${200 + entry.star * 12},80%,${60 - entry.star * 4}%)`
                          : "#e2e8f0"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 4 — Avg rating per topic (horizontal bar) */}
          <ChartCard
            title="Avg Rating by Topic"
            sub="Average star rating across all sessions"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={avgRatingPerTopic}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 4, bottom: 0 }}
                barSize={14}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#1e293b", fontWeight: 700 }}
                  itemStyle={{ color: "#3b82f6" }}
                  formatter={(v) => [`${v.toFixed(1)} / 5`, "Avg Rating"]}
                />
                <Bar dataKey="avg" radius={[0, 6, 6, 0]}>
                  {avgRatingPerTopic.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.avg >= 4
                          ? "#1d4ed8"
                          : entry.avg >= 3
                            ? "#3b82f6"
                            : "#93c5fd"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ── Due for review ── */}
      {dueTopics.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <SectionHeader
            title="Due for Review Today"
            count={dueTopics.length}
            urgent
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {dueTopicObjects.length > 0
              ? dueTopicObjects.map((t) => (
                  <DueTopicChip
                    key={t.id}
                    topic={t}
                    onRecord={() => {
                      setRecordOpen({ topicId: t.id, topicName: t.name });
                    }}
                    onHistory={() => {
                      setHistoryTopicId(t.id);
                      setHistoryTopicName(t.name);
                    }}
                  />
                ))
              : dueTopics.map((id) => (
                  <DueTopicChip
                    key={id}
                    topic={{ id, name: `Topic #${id}` }}
                    onRecord={() =>
                      setRecordOpen({ topicId: id, topicName: `Topic #${id}` })
                    }
                    onHistory={() => {
                      setHistoryTopicId(id);
                      setHistoryTopicName(`Topic #${id}`);
                    }}
                  />
                ))}
          </div>
        </section>
      )}

      {/* ── At-Risk Topics ── */}
      {atRiskTopics.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <SectionHeader
            title="Topics at Risk"
            count={atRiskTopics.length}
            risk
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 10,
            }}
          >
            {atRiskTopics.map(
              ({ topic, latestReview, reasons, severity, daysSinceReview }) => (
                <AtRiskCard
                  key={topic.id}
                  topic={topic}
                  latestReview={latestReview}
                  reasons={reasons}
                  severity={severity}
                  daysSinceReview={daysSinceReview}
                  onRecord={() =>
                    setRecordOpen({ topicId: topic.id, topicName: topic.name })
                  }
                  onHistory={() => {
                    setHistoryTopicId(topic.id);
                    setHistoryTopicName(topic.name);
                  }}
                />
              ),
            )}
          </div>
        </section>
      )}

      {/* ── Date range filter ── */}
      <section style={{ marginBottom: 28 }}>
        <SectionHeader title="Filter by Date Range" />
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <DateField label="From" value={startDate} onChange={setStartDate} />
          <DateField label="To" value={endDate} onChange={setEndDate} />
          <button
            onClick={fetchRange}
            disabled={rangeLoading}
            style={{ ...primaryBtn, padding: "10px 20px" }}
          >
            {rangeLoading ? (
              <>
                <Spinner small /> Fetching...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m21 21-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Search
              </>
            )}
          </button>
        </div>

        {rangeReviews.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p
              style={{
                fontSize: 12,
                color: "#94a3b8",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 8,
              }}
            >
              {rangeReviews.length} result{rangeReviews.length > 1 ? "s" : ""}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rangeReviews.map((r) => (
                <ReviewRow
                  key={r.id}
                  review={r}
                  onHistory={() => {
                    setHistoryTopicId(r.topicId);
                    setHistoryTopicName(r.topicName);
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {rangeReviews.length === 0 &&
          startDate &&
          endDate &&
          !rangeLoading &&
          rangeReviews !== null && (
            <p
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginTop: 10,
                paddingLeft: 4,
              }}
            >
              Hit Search to load reviews in this range.
            </p>
          )}
      </section>

      {/* ── All reviews ── */}
      <section>
        <SectionHeader title="All Reviews" count={reviews.length} />
        {reviews.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No reviews yet"
            sub="Record your first review to start tracking progress"
            action="Record Review"
            onAction={() => setRecordOpen(true)}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reviews.map((r) => (
              <ReviewRow
                key={r.id}
                review={r}
                onHistory={() => {
                  setHistoryTopicId(r.topicId);
                  setHistoryTopicName(r.topicName);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Modals ── */}
      {recordOpen && (
        <RecordReviewModal
          topicId={typeof recordOpen === "object" ? recordOpen.topicId : null}
          topicName={
            typeof recordOpen === "object" ? recordOpen.topicName : null
          }
          topics={topics}
          onClose={() => setRecordOpen(false)}
          onRecorded={handleReviewRecorded}
        />
      )}
      {historyTopicId && (
        <ReviewHistoryModal
          topicId={historyTopicId}
          topicName={historyTopicName}
          onClose={() => {
            setHistoryTopicId(null);
            setHistoryTopicName("");
          }}
        />
      )}
    </div>
  );
}

/* ─── chart tooltip style ────────────────────────────────────── */
const tooltipStyle = {
  background: "#fff",
  border: "1.5px solid #dbeafe",
  borderRadius: 10,
  boxShadow: "0 4px 16px rgba(59,130,246,0.12)",
  fontSize: 12,
  fontFamily: "inherit",
  padding: "8px 12px",
};

/* ─── sub-components ──────────────────────────────────────── */

function ChartCard({ title, sub, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </p>
        {sub && (
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{sub}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 14,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 8,
        }}
      >
        <span style={{ color: "#3b82f6" }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#1e40af",
          letterSpacing: "-0.5px",
        }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function DueTopicChip({ topic, onRecord, onHistory }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px 8px 12px",
        background: "#eff6ff",
        border: "1.5px solid #bfdbfe",
        borderRadius: 12,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#3b82f6",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8" }}>
        {topic.name}
      </span>
      <button onClick={onRecord} style={chipBtn("#dbeafe", "#1d4ed8")}>
        Review
      </button>
      <button onClick={onHistory} style={chipBtn("#e0f2fe", "#0369a1")}>
        History
      </button>
    </div>
  );
}

function ReviewRow({ review, onHistory }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      {/* Left accent */}
      <div
        style={{
          width: 3,
          height: 40,
          borderRadius: 99,
          background: "linear-gradient(180deg,#3b82f6,#1d4ed8)",
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
            {review.topicName}
          </span>
          <StarRating rating={review.rating} />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Meta icon={clockIcon} text={`${review.timeSpentMinutes}m`} />
          <Meta icon={calIcon} text={fmtTime(review.reviewedAt)} />
          {review.nextReviewDate && (
            <Meta
              icon={nextIcon}
              text={`Next: ${fmt(review.nextReviewDate)}`}
            />
          )}
          {review.notes && (
            <Meta icon={noteIcon} text={review.notes} truncate />
          )}
        </div>
      </div>

      <button onClick={onHistory} style={{ ...ghostBtn, flexShrink: 0 }}>
        History
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function AtRiskCard({
  topic,
  latestReview,
  reasons,
  severity,
  daysSinceReview,
  onRecord,
  onHistory,
}) {
  // Determine urgency tier from severity score
  const isUrgent = severity >= 40;
  const isMedium = severity >= 15 && severity < 40;
  const urgencyStyle = isUrgent
    ? {
        border: "1.5px solid #93c5fd",
        bg: "#eff6ff",
        badge: "#1d4ed8",
        badgeBg: "#dbeafe",
        dot: "#2563eb",
      }
    : isMedium
      ? {
          border: "1.5px solid #bfdbfe",
          bg: "#f0f9ff",
          badge: "#1e40af",
          badgeBg: "#dbeafe",
          dot: "#3b82f6",
        }
      : {
          border: "1.5px solid #e2e8f0",
          bg: "#f8fafc",
          badge: "#64748b",
          badgeBg: "#f1f5f9",
          dot: "#94a3b8",
        };

  const REASON_META = {
    OVERDUE: { icon: "⏰", color: "#1d4ed8", bg: "#dbeafe" },
    LOW_RATING: { icon: "⚠️", color: "#1e40af", bg: "#eff6ff" },
    STALE: { icon: "🕐", color: "#2563eb", bg: "#dbeafe" },
    NEVER: { icon: "📭", color: "#64748b", bg: "#f1f5f9" },
  };

  return (
    <div
      style={{
        background: urgencyStyle.bg,
        border: urgencyStyle.border,
        borderRadius: 14,
        padding: "14px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Urgency left bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: isUrgent
            ? "linear-gradient(180deg,#1d4ed8,#3b82f6)"
            : isMedium
              ? "linear-gradient(180deg,#3b82f6,#93c5fd)"
              : "#e2e8f0",
          borderRadius: "0 2px 2px 0",
        }}
      />

      <div style={{ paddingLeft: 6 }}>
        {/* Topic name + urgency dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: urgencyStyle.dot,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
              {topic.name}
            </span>
          </div>
          {latestReview && (
            <StarRating rating={latestReview.rating} size={12} />
          )}
        </div>

        {/* Reason tags */}
        <div
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          {reasons.map((r) => {
            const meta = REASON_META[r.type] || REASON_META.STALE;
            return (
              <span
                key={r.type}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: meta.bg,
                  color: meta.color,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <span style={{ fontSize: 10 }}>{meta.icon}</span>
                {r.label}
              </span>
            );
          })}
        </div>

        {/* Last review info */}
        {latestReview ? (
          <p style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
            Last reviewed {timeAgo(latestReview.reviewedAt)}
            {latestReview.nextReviewDate && (
              <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                {" · "}Next was {fmt(latestReview.nextReviewDate)}
              </span>
            )}
          </p>
        ) : (
          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
            No review history
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={onRecord}
            style={{
              flex: 1,
              padding: "7px 0",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11l3 3L22 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Review Now
          </button>
          <button
            onClick={onHistory}
            style={{
              padding: "7px 12px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              background: "#fff",
              border: "1.5px solid #bfdbfe",
              color: "#1d4ed8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            History
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, count, urgent, risk }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
      }}
    >
      {urgent && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#3b82f6",
          }}
        />
      )}
      {risk && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "#dbeafe",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#1d4ed8"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="17"
              x2="12.01"
              y2="17"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </h2>
      {count !== undefined && (
        <span
          style={{
            padding: "2px 9px",
            borderRadius: 20,
            background: risk ? "#dbeafe" : "#dbeafe",
            color: risk ? "#1d4ed8" : "#1d4ed8",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px dashed #bfdbfe",
        borderRadius: 16,
        padding: "48px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#334155",
          marginBottom: 4,
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 18 }}>{sub}</p>
      {action && (
        <button onClick={onAction} style={primaryBtn}>
          {action}
        </button>
      )}
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "9px 12px",
          borderRadius: 10,
          border: "1.5px solid #e2e8f0",
          fontSize: 14,
          color: "#1e293b",
          background: "#f8fafc",
          outline: "none",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3b82f6";
          e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function Meta({ icon, text, truncate }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        color: "#64748b",
        maxWidth: truncate ? 180 : undefined,
        overflow: truncate ? "hidden" : undefined,
        textOverflow: truncate ? "ellipsis" : undefined,
        whiteSpace: truncate ? "nowrap" : undefined,
      }}
    >
      <span style={{ color: "#93c5fd", flexShrink: 0 }}>{icon}</span>
      {text}
    </span>
  );
}

function Spinner({ small }) {
  const s = small ? 13 : 18;
  return (
    <span
      style={{
        width: s,
        height: s,
        border: `2px solid rgba(255,255,255,0.35)`,
        borderTop: "2px solid #fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 400,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #dbeafe",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading reviews...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

/* ─── icon nodes ──────────────────────────────────────────── */
const reviewIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 11l3 3L22 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const calIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const trendIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <polyline
      points="22 7 13.5 15.5 8.5 10.5 2 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="16 7 22 7 22 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const topicIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.7"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.7"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.4"
    />
  </svg>
);
const clockIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const avgIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const nextIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const noteIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" />
    <line
      x1="16"
      y1="13"
      x2="8"
      y2="13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── style helpers ───────────────────────────────────────── */
const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "10px 18px",
  borderRadius: 11,
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  border: "none",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
  letterSpacing: "0.1px",
};
const ghostBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "6px 12px",
  borderRadius: 9,
  background: "#eff6ff",
  border: "1.5px solid #bfdbfe",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
const chipBtn = (bg, color) => ({
  padding: "3px 9px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  border: "none",
  color,
  cursor: "pointer",
});
