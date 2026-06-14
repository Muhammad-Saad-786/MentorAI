import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { ProgressContext } from "../context/ProgressContext";
import { progressApi } from "../services/progressApi";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Flame,
  Code2,
  Clock,
  Zap,
  Calendar,
  PieChart,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = [
  "#FF6B35",
  "#2ECC71",
  "#3498DB",
  "#F39C12",
  "#E74C3C",
  "#9B59B6",
  "#1ABC9C",
];
const CHART_COLORS = {
  solved: "#2ECC71",
  attempted: "#F39C12",
  failed: "#E74C3C",
};

export default function Analytics() {
  const { progress } = useContext(ProgressContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("daily");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await progressApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8D5C4",
            borderRadius: 10,
            padding: "10px 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1A1A2E",
              margin: "0 0 6px 0",
            }}
          >
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{
                fontSize: 12,
                color: entry.color,
                margin: "2px 0",
                fontWeight: 600,
              }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8B8B9E" }}>
        <Activity size={40} color="#E8D5C4" style={{ marginBottom: 12 }} />
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) return null;

  const totals = analytics.totals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingBottom: 80 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 800,
            color: "#1A1A2E",
            margin: "0 0 4px 0",
            fontFamily: "'Cabinet Grotesk', sans-serif",
          }}
        >
          Analytics
        </h2>
        <p style={{ fontSize: 14, color: "#5C5C6E", margin: 0 }}>
          Track your coding journey with detailed insights
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            icon: Code2,
            label: "Total Executions",
            value: totals.totalExecutions,
            color: "#3498DB",
          },
          {
            icon: Target,
            label: "Problems Solved",
            value: totals.totalSolved,
            color: "#2ECC71",
          },
          {
            icon: TrendingUp,
            label: "Success Rate",
            value: `${totals.solvedRate}%`,
            color: "#FF6B35",
          },
          {
            icon: Flame,
            label: "Best Streak",
            value: `${totals.bestStreak}d`,
            color: "#F39C12",
          },
          {
            icon: Award,
            label: "Topics",
            value: totals.totalTopics,
            color: "#9B59B6",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8D5C4",
              borderRadius: 14,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: stat.color + "15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#1A1A2E",
                  margin: 0,
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 11, color: "#8B8B9E", margin: 0 }}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeframe Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["daily", "weekly"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border:
                timeframe === tf ? "2px solid #FF6B35" : "1px solid #E8D5C4",
              background: timeframe === tf ? "#FFF3E8" : "#FFFFFF",
              color: timeframe === tf ? "#FF6B35" : "#5C5C6E",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              textTransform: "capitalize",
            }}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Activity Chart */}
        <Card padding="24px">
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A2E",
              margin: "0 0 20px 0",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Activity size={18} color="#FF6B35" />
            {timeframe === "daily"
              ? "Daily Activity (30 Days)"
              : "Weekly Summary"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            {timeframe === "daily" ? (
              <AreaChart data={analytics.dailyActivity}>
                <defs>
                  <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#8B8B9E" }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#8B8B9E" }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="solved"
                  stroke="#2ECC71"
                  fill="url(#colorSolved)"
                  strokeWidth={2}
                  name="Solved"
                />
                <Area
                  type="monotone"
                  dataKey="attempted"
                  stroke="#F39C12"
                  fill="none"
                  strokeWidth={1.5}
                  name="Attempted"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            ) : (
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10, fill: "#8B8B9E" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#8B8B9E" }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="solved"
                  fill="#2ECC71"
                  radius={[6, 6, 0, 0]}
                  name="Solved"
                />
                <Bar
                  dataKey="attempted"
                  fill="#F39C12"
                  radius={[6, 6, 0, 0]}
                  name="Attempted"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Language Distribution */}
        <Card padding="24px">
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A2E",
              margin: "0 0 20px 0",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PieChart size={18} color="#FF6B35" />
            Language Distribution
          </h3>
          {analytics.languageStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RPieChart>
                <Pie
                  data={analytics.languageStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {analytics.languageStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RPieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#8B8B9E" }}>
              No language data yet
            </div>
          )}
        </Card>
      </div>

      {/* Topic Mastery Chart */}
      <Card padding="24px" style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1A1A2E",
            margin: "0 0 20px 0",
            fontFamily: "'Cabinet Grotesk', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Zap size={18} color="#FF6B35" />
          Topic Mastery
        </h3>
        {analytics.topicStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analytics.topicStats}
              layout="vertical"
              margin={{ left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#8B8B9E" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#1A1A2E", fontWeight: 600 }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} name="Mastery Score">
                {analytics.topicStats.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.score >= 70
                        ? "#2ECC71"
                        : entry.score >= 40
                          ? "#F39C12"
                          : "#E74C3C"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: 40, color: "#8B8B9E" }}>
            No topic data yet. Run some code!
          </div>
        )}
      </Card>
    </motion.div>
  );
}
