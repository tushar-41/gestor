"use client";

import { useEffect, useState, useMemo } from "react";
import { apiCall, logout } from "@/lib/auth";
import { toast } from "sonner";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

/* ─── helpers ──────────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return "N/A";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
function fmt(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtShort(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const BLUE = {
  700: "#1d4ed8",
  600: "#2563eb",
  500: "#3b82f6",
  400: "#60a5fa",
  300: "#93c5fd",
  100: "#dbeafe",
  50: "#eff6ff",
};

const tooltipStyle = {
  background: "#fff",
  border: `1.5px solid ${BLUE[100]}`,
  borderRadius: 10,
  boxShadow: "0 4px 16px rgba(59,130,246,0.12)",
  fontSize: 12,
  fontFamily: "inherit",
  padding: "8px 12px",
};

function confidenceColor(level) {
  if (!level && level !== 0) return BLUE[300];
  if (level >= 4) return BLUE[700];
  if (level >= 3) return BLUE[500];
  if (level >= 2) return BLUE[400];
  return BLUE[300];
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [journey, setJourney] = useState(null);
  const [pathCount, setPathCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [userRes, journeyRes, countRes] = await Promise.all([
        apiCall("/current_user"),
        apiCall("/api/learning-path/journey").catch(() => null),
        apiCall("/api/learning-path/count").catch(() => null),
      ]);

      if (userRes) {
        if (typeof userRes === "string") {
          const parts = userRes.split(" ");
          setUser({ name: parts[0], username: parts[0], id: parts[1] });
        } else {
          setUser(userRes);
        }
      }
      setJourney(journeyRes || null);
      setPathCount(typeof countRes === "number" ? countRes : null);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  /* ── chart data ── */
  const path = journey?.path || [];

  const radarData = useMemo(() => {
    const catMap = {};
    path.forEach((p) => {
      const cat = p.category || "General";
      if (!catMap[cat]) catMap[cat] = { count: 0, confSum: 0 };
      catMap[cat].count++;
      catMap[cat].confSum += p.confidenceLevel || 0;
    });
    return Object.entries(catMap).map(([cat, { count, confSum }]) => ({
      subject: cat.length > 10 ? cat.slice(0, 10) + "…" : cat,
      fullCat: cat,
      topics: count,
      confidence: parseFloat((confSum / count).toFixed(1)),
    }));
  }, [path]);

  const progressOverTime = useMemo(() => {
    const sorted = [...path].sort(
      (a, b) => new Date(a.learnedDate) - new Date(b.learnedDate),
    );
    return sorted.map((p, i) => ({
      date: fmtShort(p.learnedDate),
      topic: p.topicName,
      cumulative: i + 1,
      confidence: p.confidenceLevel || 0,
    }));
  }, [path]);

  const confidenceDist = useMemo(() => {
    const levels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    path.forEach((p) => {
      const l = Math.round(p.confidenceLevel || 0);
      if (l >= 1 && l <= 5) levels[l]++;
    });
    return [1, 2, 3, 4, 5].map((l) => ({
      level: `L${l}`,
      count: levels[l],
      raw: l,
    }));
  }, [path]);

  const topicConfidenceData = useMemo(
    () =>
      [...path].slice(-10).map((p) => ({
        name:
          p.topicName.length > 14
            ? p.topicName.slice(0, 14) + "…"
            : p.topicName,
        confidence: p.confidenceLevel || 0,
        full: p,
      })),
    [path],
  );

  if (isLoading) return <PageLoader />;

  const displayName = user?.name || user?.username || "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const totalTopics = journey?.totalTopics ?? pathCount ?? path.length;
  const durationDays = journey?.durationDays ?? 0;
  const journeyStart = journey?.journeyStartDate;
  const avgConf = path.length
    ? (
        path.reduce((s, p) => s + (p.confidenceLevel || 0), 0) / path.length
      ).toFixed(1)
    : null;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#f8fafc",
        paddingBottom: 48,
      }}
    >
      {/* ══════════════════════════════════════════
          HERO — LeetCode-style banner
      ══════════════════════════════════════════ */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: 24,
        }}
      >
        {/* Banner */}
        <div
          style={{
            height: 96,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -30,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 80,
              bottom: -50,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 160,
              top: -20,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
        </div>

        {/* Profile content */}
        <div
          style={{ maxWidth: 920, margin: "0 auto", padding: "0 28px 24px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 20,
              marginTop: -42,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-1px",
                border: "4px solid #fff",
                boxShadow: "0 6px 24px rgba(29,78,216,0.3)",
              }}
            >
              {initials}
            </div>

            {/* Name + meta */}
            <div style={{ paddingBottom: 4, flex: 1, minWidth: 180 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 3,
                }}
              >
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {displayName}
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: BLUE[50],
                    border: `1px solid ${BLUE[100]}`,
                    color: BLUE[600],
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22c55e",
                    }}
                  />
                  Active
                </span>
              </div>
              {user?.email && (
                <p style={{ fontSize: 13, color: "#64748b" }}>{user.email}</p>
              )}
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                Member since {fmt(user?.createdAt)}
                {user?.id && ` · ID : ${user.id}`}
              </p>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 18px",
                borderRadius: 10,
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 4,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#fca5a5";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              {loggingOut ? (
                <>
                  <Spinner color="#94a3b8" />
                  Signing out...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="16 17 21 12 16 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="21"
                      y1="12"
                      x2="9"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>

          {/* Quick stats row */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginTop: 20,
              background: BLUE[50],
              borderRadius: 14,
              border: `1px solid ${BLUE[100]}`,
              overflow: "hidden",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                value: totalTopics ?? "—",
                label: "Topics Learned",
                icon: "📚",
              },
              {
                value: durationDays ? `${durationDays}d` : "—",
                label: "Journey Length",
                icon: "🗓",
              },
              {
                value: avgConf ? `${avgConf}/5` : "—",
                label: "Avg Confidence",
                icon: "⭐",
              },
              {
                value: journeyStart ? fmt(journeyStart) : "—",
                label: "Journey Start",
                icon: "🚀",
              },
              {
                value:
                  path.length > 0
                    ? (path[path.length - 1]?.topicName ?? "—")
                    : "—",
                label: "Latest Topic",
                icon: "🔥",
                truncate: true,
              },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                style={{
                  flex: "1 1 140px",
                  padding: "14px 18px",
                  borderRight:
                    i < arr.length - 1 ? `1px solid ${BLUE[100]}` : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: BLUE[700],
                      letterSpacing: "-0.3px",
                      overflow: s.truncate ? "hidden" : undefined,
                      textOverflow: s.truncate ? "ellipsis" : undefined,
                      whiteSpace: s.truncate ? "nowrap" : undefined,
                      maxWidth: s.truncate ? 120 : undefined,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: BLUE[500],
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BODY — Charts + Timeline
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 28px" }}>
        {path.length === 0 ? (
          <EmptyLearningPath />
        ) : (
          <>
            {/* Row 1: Area chart + Radar/bars */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 2fr",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <ChartCard
                title="Learning Progress"
                sub={`${path.length} topics · cumulative growth over time`}
              >
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart
                    data={progressOverTime}
                    margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={BLUE[500]}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={BLUE[500]}
                          stopOpacity={0.02}
                        />
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
                      interval="preserveStartEnd"
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
                      formatter={(v) => [`${v} topics`, "Cumulative"]}
                      labelFormatter={(label, payload) =>
                        payload?.[0]?.payload?.topic
                          ? `${payload[0].payload.topic} · ${label}`
                          : label
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke={BLUE[500]}
                      strokeWidth={2.5}
                      fill="url(#progGrad)"
                      dot={{ r: 3, fill: BLUE[500], strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: BLUE[700] }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Topics by Category"
                sub="Coverage across skill areas"
              >
                {radarData.length >= 3 ? (
                  <ResponsiveContainer width="100%" height={210}>
                    <RadarChart
                      data={radarData}
                      margin={{ top: 10, right: 24, bottom: 10, left: 24 }}
                    >
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                      />
                      <Radar
                        name="Topics"
                        dataKey="topics"
                        stroke={BLUE[500]}
                        fill={BLUE[500]}
                        fillOpacity={0.2}
                        strokeWidth={2}
                        dot={{ fill: BLUE[600], r: 3 }}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v) => [v, "Topics"]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <CategoryBars data={radarData} />
                )}
              </ChartCard>
            </div>

            {/* Row 2: Confidence dist + Confidence per topic */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <ChartCard
                title="Confidence Distribution"
                sub="Star level breakdown"
              >
                <ResponsiveContainer width="100%" height={185}>
                  <BarChart
                    data={confidenceDist}
                    margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    barSize={30}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="level"
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
                      formatter={(v) => [v, "Topics"]}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {confidenceDist.map((entry) => (
                        <Cell
                          key={entry.level}
                          fill={confidenceColor(entry.raw)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Topic Confidence Scores"
                sub="Most recent 10 topics · horizontal view"
              >
                <ResponsiveContainer width="100%" height={185}>
                  <BarChart
                    data={topicConfidenceData}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                    barSize={13}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                      width={84}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v}/5`, "Confidence"]}
                    />
                    <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
                      {topicConfidenceData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={confidenceColor(entry.full?.confidenceLevel)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Full learning path timeline */}
            <PathTimelineCard path={path} />
          </>
        )}

        {/* Account details card */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 16,
            padding: "20px 24px",
            marginTop: 14,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 12,
            }}
          >
            Account Details
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 4,
            }}
          >
            <InfoRow
              label="Username"
              value={user?.username || user?.name || "—"}
            />
            <InfoRow label="Email" value={user?.email || "Not provided"} />
            <InfoRow label="User ID" value={`${user?.id}`} />
            <InfoRow
              label="Member Since"
              value={fmt(user?.createdAt)}
              sub={timeAgo(user?.createdAt)}
            />
          </div>
        </div>

        <p
          style={{
            fontSize: 11,
            color: "#cbd5e1",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Account {user?.id} · Data secured and private
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

/* ─── Path Timeline Card (state owner) ───────────────────── */
function PathTimelineCard({ path }) {
  const [hovered, setHovered] = useState(null);
  const hoveredTopic = hovered !== null ? path[hovered] : null;

  return (
    <ChartCard
      title="Learning Path Timeline"
      sub={`Complete journey · ${path.length} topics in sequence · hover a node for details`}
    >
      {/* Scrollable timeline — NO overflow:visible needed, tooltip lives outside */}
      <div style={{ overflowX: "auto", overflowY: "visible" }}>
        <PathTimeline path={path} hovered={hovered} setHovered={setHovered} />
      </div>

      {/* Detail panel — always below the scroll container, no overflow issues */}
      <TopicDetailPanel topic={hoveredTopic} index={hovered} />
    </ChartCard>
  );
}

/* ─── Topic Detail Panel ──────────────────────────────────── */
function TopicDetailPanel({ topic, index }) {
  if (!topic) {
    return (
      <div
        style={{
          marginTop: 12,
          padding: "11px 16px",
          borderRadius: 12,
          background: BLUE[50],
          border: `1.5px dashed ${BLUE[100]}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 3H19a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
            stroke={BLUE[400]}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 3v12M9 12l3 3 3-3"
            stroke={BLUE[400]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p style={{ fontSize: 12, color: BLUE[400], fontWeight: 500 }}>
          Hover a topic node to see its details
        </p>
      </div>
    );
  }

  const cc = confidenceColor(topic.confidenceLevel);
  const confLabel =
    ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"][
      Math.round(topic.confidenceLevel)
    ] || "—";

  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 14,
        background: "#fff",
        border: `1.5px solid ${BLUE[100]}`,
        overflow: "hidden",
        animation: "fadeSlide 0.18s ease both",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Node badge */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg,${cc},${BLUE[700]})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            fontWeight: 800,
            boxShadow: `0 4px 12px ${cc}50`,
          }}
        >
          {topic.sequenceNumber || index + 1}
        </div>

        {/* Topic info */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.3px",
              marginBottom: 3,
            }}
          >
            {topic.topicName}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {topic.category && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: BLUE[50],
                  color: BLUE[600],
                  border: `1px solid ${BLUE[100]}`,
                }}
              >
                📂 {topic.category}
              </span>
            )}
            {topic.learnedDate && (
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                📅 {fmt(topic.learnedDate)}
              </span>
            )}
          </div>
        </div>

        {/* Confidence meter */}
        {topic.confidenceLevel != null && (
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: 5,
              }}
            >
              Confidence
            </p>
            <div
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "flex-end",
                marginBottom: 3,
              }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  style={{
                    width: 20,
                    height: 6,
                    borderRadius: 3,
                    background: s <= topic.confidenceLevel ? cc : BLUE[50],
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: cc }}>
              {topic.confidenceLevel}/5 · {confLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Path Timeline (pure display, no state) ─────────────── */
function PathTimeline({ path, hovered, setHovered }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "20px 0 8px",
        minWidth: Math.max(path.length * 90, 400),
      }}
    >
      {/* Connecting gradient line */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 40,
          right: 40,
          height: 2,
          background: `linear-gradient(90deg, ${BLUE[700]}, ${BLUE[400]})`,
          borderRadius: 2,
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {path.map((p, i) => {
          const isHov = hovered === i;
          const cc = confidenceColor(p.confidenceLevel);

          return (
            <div
              key={p.topicId || i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "1 1 0",
                minWidth: 76,
                cursor: "default",
                position: "relative",
                animation: `fadeSlide 0.3s ease ${Math.min(i * 35, 600)}ms both`,
              }}
            >
              {/* Node circle */}
              <div
                style={{
                  width: isHov ? 38 : 30,
                  height: isHov ? 38 : 30,
                  borderRadius: "50%",
                  background: isHov
                    ? `linear-gradient(135deg,${cc},${BLUE[700]})`
                    : cc,
                  border: `3px solid ${isHov ? BLUE[100] : "#fff"}`,
                  boxShadow: isHov
                    ? `0 0 0 4px ${cc}35, 0 6px 16px rgba(59,130,246,0.35)`
                    : "0 2px 6px rgba(59,130,246,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  zIndex: 2,
                  position: "relative",
                  marginBottom: 10,
                }}
              >
                {p.sequenceNumber || i + 1}
              </div>

              {/* Topic name — highlighted on hover, NO absolute children */}
              <p
                style={{
                  fontSize: 10,
                  fontWeight: isHov ? 700 : 500,
                  color: isHov ? BLUE[700] : "#475569",
                  textAlign: "center",
                  lineHeight: 1.3,
                  maxWidth: 76,
                  wordBreak: "break-word",
                  transition: "color 0.15s",
                }}
              >
                {p.topicName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
      <div style={{ marginBottom: 12 }}>
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

function InfoRow({ label, value, sub }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: 3,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{value}</p>
      {sub && (
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sub}</p>
      )}
    </div>
  );
}

function CategoryBars({ data }) {
  const max = Math.max(...data.map((d) => d.topics), 1);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingTop: 8,
      }}
    >
      {data.map((d) => (
        <div key={d.subject}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>
              {d.fullCat || d.subject}
            </span>
            <span style={{ fontSize: 11, color: BLUE[600], fontWeight: 700 }}>
              {d.topics}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: BLUE[50],
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(d.topics / max) * 100}%`,
                background: `linear-gradient(90deg,${BLUE[400]},${BLUE[700]})`,
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyLearningPath() {
  return (
    <div
      style={{
        background: "#fff",
        border: `1.5px dashed ${BLUE[100]}`,
        borderRadius: 16,
        padding: "60px 20px",
        textAlign: "center",
        marginBottom: 14,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#334155",
          marginBottom: 4,
        }}
      >
        No learning path yet
      </p>
      <p style={{ fontSize: 13, color: "#94a3b8" }}>
        Start learning topics to build your path and visualize your journey
      </p>
    </div>
  );
}

function Spinner({ color = "#fff" }) {
  return (
    <span
      style={{
        width: 13,
        height: 13,
        border: `2px solid ${color}40`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
        marginRight: 4,
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
            border: `3px solid ${BLUE[100]}`,
            borderTop: `3px solid ${BLUE[500]}`,
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading profile...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
