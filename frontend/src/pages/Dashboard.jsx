import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Flame, Code2, Bug, Clock, Target, ChevronRight } from "lucide-react";

// Animated counter hook
function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  color = "#FF6B35",
}) {
  const animatedValue = useCountUp(value);
  return (
    <Card delay={0} padding="20px" hover>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p className="stat-label">{label}</p>
          <h3 className="stat-value">
            {animatedValue}
            {suffix}
          </h3>
        </div>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#FFF3E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} color={color} />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const recentActivity = [
    {
      type: "code",
      title: "Solved: Two Sum",
      language: "JavaScript",
      time: "2 hours ago",
      status: "success",
    },
    {
      type: "debug",
      title: "Fixed recursion bug",
      language: "Python",
      time: "5 hours ago",
      status: "success",
    },
    {
      type: "learn",
      title: "Learned: Binary Search Trees",
      language: "DSA",
      time: "Yesterday",
      status: "info",
    },
    {
      type: "code",
      title: "Attempted: Merge Sort",
      language: "Java",
      time: "Yesterday",
      status: "warning",
    },
    {
      type: "mentor",
      title: "AI session: Closures",
      language: "JavaScript",
      time: "2 days ago",
      status: "info",
    },
  ];

  const weakTopics = [
    { topic: "Dynamic Programming", score: 35, color: "#E74C3C" },
    { topic: "Graph Algorithms", score: 42, color: "#F39C12" },
    { topic: "Recursion", score: 55, color: "#F39C12" },
    { topic: "System Design", score: 60, color: "#3498DB" },
  ];

  const recommendedProblems = [
    { title: "Climbing Stairs", difficulty: "Easy", topic: "DP" },
    { title: "Course Schedule", difficulty: "Medium", topic: "Graph" },
    { title: "Word Break", difficulty: "Medium", topic: "DP" },
  ];

  const statusColor = (status) =>
    status === "success"
      ? "#2ECC71"
      : status === "warning"
        ? "#F39C12"
        : "#3498DB";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="dashboard-container"
      >
        {/* Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">
            Welcome back, {user?.name || "Developer"} 👋
          </h2>
          <p className="dashboard-subtitle">
            Ready to continue your coding journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={Flame}
            label="Day Streak"
            value={7}
            suffix=" days"
            color="#FF6B35"
          />
          <StatCard
            icon={Code2}
            label="Problems Solved"
            value={42}
            color="#2ECC71"
          />
          <StatCard icon={Bug} label="Bugs Fixed" value={28} color="#E74C3C" />
          <StatCard
            icon={Clock}
            label="Hours Coded"
            value={18}
            suffix="h"
            color="#004E64"
          />
        </div>

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Recent Activity */}
          <Card padding="24px">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <Badge variant="info">Last 7 days</Badge>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="activity-item"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#FF6B35")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#E8D5C4")
                  }
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: statusColor(activity.status),
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-meta">
                      {activity.language} · {activity.time}
                    </p>
                  </div>
                  <ChevronRight size={14} color="#8B8B9E" />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Right Column */}
          <div className="right-column">
            {/* Weak Topics */}
            <Card padding="24px">
              <h3 className="card-title" style={{ marginBottom: "20px" }}>
                Weak Topics
              </h3>
              <div className="topics-list">
                {weakTopics.map((topic, index) => (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="topic-header">
                      <span className="topic-name">{topic.topic}</span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: topic.color,
                        }}
                      >
                        {topic.score}%
                      </span>
                    </div>
                    <div className="topic-bar-bg">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.score}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.5 + index * 0.1,
                          ease: "easeOut",
                        }}
                        className="topic-bar-fill"
                        style={{ backgroundColor: topic.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recommended Problems */}
            <Card padding="24px">
              <div className="card-header">
                <h3 className="card-title">Recommended</h3>
                <Badge variant="secondary">Based on your gaps</Badge>
              </div>
              <div className="recommended-list">
                {recommendedProblems.map((problem, index) => (
                  <motion.div
                    key={problem.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="recommended-item"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#FF6B35")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#E8D5C4")
                    }
                  >
                    <div className="recommended-left">
                      <Target size={16} color="#FF6B35" />
                      <div>
                        <p className="recommended-title">{problem.title}</p>
                        <p className="recommended-topic">{problem.topic}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        problem.difficulty === "Easy"
                          ? "success"
                          : problem.difficulty === "Medium"
                            ? "warning"
                            : "error"
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* ===== RESPONSIVE STYLES ===== */}
      <style>{`
        /* Base styles (desktop) */
        .dashboard-container {
          padding-bottom: 80px;
        }
        .dashboard-header {
          margin-bottom: 32px;
        }
        .dashboard-title {
          font-size: 28px;
          font-weight: 800;
          color: #1A1A2E;
          margin: 0 0 6px 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .dashboard-subtitle {
          font-size: 14px;
          color: #5C5C6E;
          margin: 0;
        }
        .stat-label {
          font-size: 12px;
          color: #8B8B9E;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #1A1A2E;
          margin: 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        /* Grids */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Card shared */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1A1A2E;
          margin: 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        /* Activity */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          background-color: #FFFBF5;
          border: 1px solid #E8D5C4;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .activity-title {
          font-size: 13px;
          font-weight: 600;
          color: #1A1A2E;
          margin: 0 0 2px 0;
        }
        .activity-meta {
          font-size: 11px;
          color: #8B8B9E;
          margin: 0;
        }

        /* Topics */
        .topics-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .topic-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .topic-name {
          font-size: 13px;
          font-weight: 600;
          color: #1A1A2E;
        }
        .topic-bar-bg {
          height: 6px;
          background-color: #F0EBE3;
          border-radius: 3px;
          overflow: hidden;
        }
        .topic-bar-fill {
          height: 100%;
          border-radius: 3px;
        }

        /* Recommended */
        .recommended-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .recommended-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: 10px;
          background-color: #FFFBF5;
          border: 1px solid #E8D5C4;
          cursor: pointer;
          transition: border-color 0.2s ease;
          gap: 12px;
        }
        .recommended-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .recommended-title {
          font-size: 13px;
          font-weight: 600;
          color: #1A1A2E;
          margin: 0 0 2px 0;
        }
        .recommended-topic {
          font-size: 11px;
          color: #8B8B9E;
          margin: 0;
        }

        /* ===== TABLET (768px - 1023px) ===== */
        @media (max-width: 1023px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            margin-bottom: 24px;
          }
          .main-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .dashboard-title {
            font-size: 24px;
          }
          .stat-value {
            font-size: 26px;
          }
        }

        /* ===== MOBILE (below 768px) ===== */
        @media (max-width: 767px) {
          .dashboard-container {
            padding-bottom: 80px;
          }
          .dashboard-header {
            margin-bottom: 20px;
          }
          .dashboard-title {
            font-size: 20px;
          }
          .dashboard-subtitle {
            font-size: 13px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .stat-label {
            font-size: 10px;
            margin-bottom: 4px;
          }
          .stat-value {
            font-size: 22px;
          }
          .main-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .right-column {
            gap: 16px;
          }
          .card-title {
            font-size: 16px;
          }
          .card-header {
            margin-bottom: 14px;
          }
          .activity-item {
            padding: 10px 12px;
            gap: 10px;
          }
          .activity-title {
            font-size: 12px;
          }
          .recommended-item {
            padding: 10px 12px;
          }
        }
      `}</style>
    </>
  );
}
