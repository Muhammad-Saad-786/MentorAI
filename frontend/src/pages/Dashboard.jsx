import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { ProgressContext } from "../context/ProgressContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import SkillGraph from "../components/dashboard/SkillGraph";
import TopicChart from "../components/dashboard/TopicChart";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Code2,
  Bug,
  Clock,
  Target,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";

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
  const displayValue = typeof value === "number" ? value : 0;
  const animatedValue = useCountUp(displayValue);

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
          <p
            style={{
              fontSize: 12,
              color: "#8B8B9E",
              fontWeight: 600,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </p>
          <h3
            style={{
              fontSize: "clamp(20px, 2.5vw, 32px)",
              fontWeight: 800,
              color: "#1A1A2E",
              margin: 0,
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >
            {typeof value === "number" ? animatedValue : value}
            {suffix}
          </h3>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: color + "15",
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
  const { progress, chatSessions, getWeakTopics, getRecommendations } =
    useContext(ProgressContext);

  const weakTopics = getWeakTopics();
  const recommendations = getRecommendations();
  const recentActivity = (progress?.recentActivity || []).slice(0, 5);
  const navigate = useNavigate();
  const modeIcon = (mode) => {
    if (mode === "socratic") return <Sparkles size={16} color="#FF6B35" />;
    if (mode === "debug") return <Bug size={16} color="#E74C3C" />;
    if (mode === "review") return <Code2 size={16} color="#3498DB" />;
    return <MessageSquare size={16} color="#FF6B35" />;
  };

  const modeBadgeVariant = (mode) => {
    if (mode === "socratic") return "warning";
    if (mode === "debug") return "error";
    if (mode === "review") return "info";
    return "secondary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
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
          Welcome back, {user?.name || "Developer"} 👋
        </h2>
        <p style={{ fontSize: 14, color: "#5C5C6E", margin: 0 }}>
          Ready to continue your coding journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={progress?.currentStreak || 0}
          suffix=" days"
          color="#FF6B35"
        />
        <StatCard
          icon={Code2}
          label="Problems Solved"
          value={progress?.totalSolved || 0}
          color="#2ECC71"
        />
        <StatCard
          icon={Bug}
          label="Total Attempts"
          value={progress?.totalAttempts || 0}
          color="#E74C3C"
        />
        <StatCard
          icon={Clock}
          label="Best Streak"
          value={progress?.bestStreak || 0}
          suffix=" days"
          color="#004E64"
        />
      </div>

      {/* Skill Graph + Topic Chart Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Skill Graph */}
        <Card padding="24px">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1A1A2E",
                margin: 0,
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Skill Graph
            </h3>
            <Badge variant="secondary">DAG View</Badge>
          </div>
          <SkillGraph topics={progress?.topics || []} />
        </Card>

        {/* Topic Mastery */}
        <Card padding="24px">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1A1A2E",
                margin: 0,
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Topic Mastery
            </h3>
            <Badge variant="info">{progress?.topics?.length || 0} topics</Badge>
          </div>
          {(progress?.topics || []).length > 0 ? (
            <TopicChart topics={progress.topics} />
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#8B8B9E",
                fontSize: 13,
                padding: 24,
              }}
            >
              Run some code to see your topic progress!
            </p>
          )}
        </Card>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Recent Activity */}
        <Card padding="24px">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1A1A2E",
                margin: 0,
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Recent Activity
            </h3>
            <Badge variant="info">Live</Badge>
          </div>
          {recentActivity.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 10,
                    background: "#FFFBF5",
                    border: "1px solid #E8D5C4",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#FF6B35")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#E8D5C4")
                  }
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background:
                        activity.status === "solved" ? "#2ECC71" : "#F39C12",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1A1A2E",
                        margin: "0 0 2px 0",
                      }}
                    >
                      {activity.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#8B8B9E", margin: 0 }}>
                      {activity.language} ·{" "}
                      {new Date(activity.time).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "solved" ? "success" : "warning"
                    }
                  >
                    {activity.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#8B8B9E",
                fontSize: 13,
                padding: 24,
              }}
            >
              Run some code to see your activity here!
            </p>
          )}
        </Card>

        {/* Right Column: Weak Topics + Recommended */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Weak Topics */}
          <Card padding="24px">
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1A1A2E",
                margin: "0 0 16px 0",
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Weak Topics
            </h3>
            {weakTopics.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {weakTopics.map((topic, i) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1A1A2E",
                        }}
                      >
                        {topic.name}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: topic.score < 30 ? "#E74C3C" : "#F39C12",
                        }}
                      >
                        {topic.score}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "#F0EBE3",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        style={{
                          height: "100%",
                          background: topic.score < 30 ? "#E74C3C" : "#F39C12",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "#8B8B9E",
                  fontSize: 13,
                  padding: 24,
                }}
              >
                No weak topics yet. Keep practicing!
              </p>
            )}
          </Card>

          {/* Recommended */}
          <Card padding="24px">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#1A1A2E",
                  margin: 0,
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
              >
                Recommended
              </h3>
              <Badge variant="secondary">Based on progress</Badge>
            </div>
            {recommendations.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {recommendations.map((rec, i) => (
                  <motion.div
                    key={rec.topic}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 12,
                      borderRadius: 10,
                      background: "#FFFBF5",
                      border: "1px solid #E8D5C4",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#FF6B35")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#E8D5C4")
                    }
                  >
                    <Target size={16} color="#FF6B35" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1A1A2E",
                          margin: "0 0 2px 0",
                        }}
                      >
                        {rec.topic}
                      </p>
                      <p style={{ fontSize: 11, color: "#8B8B9E", margin: 0 }}>
                        {rec.reason}
                      </p>
                    </div>
                    <ChevronRight size={14} color="#8B8B9E" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "#8B8B9E",
                  fontSize: 13,
                  padding: 24,
                }}
              >
                Complete more topics to get recommendations.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Chat History */}
      {chatSessions && chatSessions.length > 0 && (
        <Card padding="24px">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1A1A2E",
                margin: 0,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <MessageSquare size={20} color="#FF6B35" />
              Recent Chat Sessions
            </h3>
            <Badge variant="info">{chatSessions.length} sessions</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {chatSessions.slice(0, 5).map((session, index) => (
              <motion.div
                key={session._id}
                onClick={() => navigate(`/mentor?session=${session._id}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#FFFBF5",
                  border: "1px solid #E8D5C4",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#FF6B35")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#E8D5C4")
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#FFF3E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {modeIcon(session.mode)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1A1A2E",
                      margin: "0 0 2px 0",
                      textTransform: "capitalize",
                    }}
                  >
                    {session.mode} Mode
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#8B8B9E",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {session.lastMessage || `${session.messageCount} messages`}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <Badge variant={modeBadgeVariant(session.mode)}>
                    {session.messageCount} msgs
                  </Badge>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#8B8B9E",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight size={14} color="#8B8B9E" />
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
