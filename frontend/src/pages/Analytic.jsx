import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { progressApi } from "../services/progressApi";
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Zap,
  Flame,
  Brain,
  Code2,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await progressApi.getProgress(user?._id || "default");
      setProgress(data);
    } catch (error) {
      console.error("Failed to load progress:", error);
      // Use mock data for demo
      setProgress({
        totalAttempts: 42,
        totalSolved: 28,
        currentStreak: 5,
        bestStreak: 12,
        topics: [
          { name: "Variables", score: 95, attempts: 10, solved: 10 },
          { name: "Functions", score: 80, attempts: 8, solved: 6 },
          { name: "Arrays", score: 65, attempts: 12, solved: 7 },
          { name: "Recursion", score: 40, attempts: 5, solved: 2 },
          { name: "Sorting", score: 30, attempts: 4, solved: 1 },
          { name: "Dynamic Programming", score: 15, attempts: 3, solved: 0 },
        ],
        weakTopics: [
          { name: "Dynamic Programming", score: 15 },
          { name: "Sorting", score: 30 },
          { name: "Recursion", score: 40 },
        ],
        recommendations: [
          { topic: "Recursion", reason: "Prerequisites met (Functions)" },
          { topic: "Sorting", reason: "Prerequisites met (Arrays)" },
        ],
        recentActivity: [
          {
            title: "Solved: Two Sum",
            language: "javascript",
            status: "solved",
            time: new Date(),
          },
          {
            title: "Attempted: Merge Sort",
            language: "python",
            status: "attempted",
            time: new Date(),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#2ECC71";
    if (score >= 40) return "#F39C12";
    return "#E74C3C";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="analytics-page"
      >
        {/* Header */}
        <div className="analytics-header">
          <h2>Analytics</h2>
          <p>Track your coding journey and identify areas to improve</p>
        </div>

        {loading ? (
          <div className="analytics-loading">Loading your analytics...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="analytics-stats">
              {[
                {
                  icon: Code2,
                  label: "Problems Solved",
                  value: progress?.totalSolved || 0,
                  color: "#2ECC71",
                },
                {
                  icon: Target,
                  label: "Total Attempts",
                  value: progress?.totalAttempts || 0,
                  color: "#3498DB",
                },
                {
                  icon: Flame,
                  label: "Current Streak",
                  value: `${progress?.currentStreak || 0} days`,
                  color: "#FF6B35",
                },
                {
                  icon: Award,
                  label: "Best Streak",
                  value: `${progress?.bestStreak || 0} days`,
                  color: "#F39C12",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="analytics-stat-card"
                >
                  <div
                    className="analytics-stat-icon"
                    style={{ backgroundColor: stat.color + "15" }}
                  >
                    <stat.icon size={22} color={stat.color} />
                  </div>
                  <div>
                    <p className="analytics-stat-value">{stat.value}</p>
                    <p className="analytics-stat-label">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="analytics-grid">
              {/* Skill Overview */}
              <div className="analytics-card">
                <h3 className="analytics-card-title">
                  <Brain size={20} color="#FF6B35" />
                  Skill Overview
                </h3>
                <div className="analytics-skills">
                  {(progress?.topics || []).map((topic, i) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="analytics-skill-row"
                    >
                      <div className="analytics-skill-header">
                        <span className="analytics-skill-name">
                          {topic.name}
                        </span>
                        <span
                          className="analytics-skill-score"
                          style={{ color: getScoreColor(topic.score) }}
                        >
                          {topic.score}%
                        </span>
                      </div>
                      <div className="analytics-skill-bar">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${topic.score}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                          className="analytics-skill-fill"
                          style={{
                            backgroundColor: getScoreColor(topic.score),
                          }}
                        />
                      </div>
                      <div className="analytics-skill-meta">
                        {topic.solved}/{topic.attempts} solved
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="analytics-right">
                {/* Weak Topics */}
                <div className="analytics-card">
                  <h3 className="analytics-card-title">
                    <Zap size={20} color="#F39C12" />
                    Weak Topics
                  </h3>
                  {(progress?.weakTopics || []).length > 0 ? (
                    <div className="analytics-weak-list">
                      {(progress?.weakTopics || []).map((topic, i) => (
                        <div key={topic.name} className="analytics-weak-item">
                          <div
                            className="analytics-weak-dot"
                            style={{
                              backgroundColor: getScoreColor(topic.score),
                            }}
                          />
                          <span>{topic.name}</span>
                          <span
                            style={{
                              color: getScoreColor(topic.score),
                              fontWeight: 700,
                              marginLeft: "auto",
                            }}
                          >
                            {topic.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="analytics-empty">
                      No weak topics detected yet. Keep coding!
                    </p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="analytics-card">
                  <h3 className="analytics-card-title">
                    <TrendingUp size={20} color="#2ECC71" />
                    Recommended Next
                  </h3>
                  {(progress?.recommendations || []).length > 0 ? (
                    <div className="analytics-rec-list">
                      {(progress?.recommendations || []).map((rec, i) => (
                        <div key={rec.topic} className="analytics-rec-item">
                          <Target size={16} color="#FF6B35" />
                          <div>
                            <p className="analytics-rec-title">{rec.topic}</p>
                            <p className="analytics-rec-reason">{rec.reason}</p>
                          </div>
                          <ChevronRight size={14} color="#8B8B9E" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="analytics-empty">
                      Complete more topics to get recommendations.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <style>{`
        .analytics-page { padding-bottom: 80px; }
        .analytics-header { margin-bottom: 28px; }
        .analytics-header h2 {
          font-size: 28px; font-weight: 800; color: #1A1A2E;
          margin: 0 0 4px 0; font-family: 'Cabinet Grotesk', sans-serif;
        }
        .analytics-header p { font-size: 14px; color: #5C5C6E; margin: 0; }
        .analytics-loading {
          text-align: center; padding: 60px 20px;
          color: #8B8B9E; font-size: 15px;
        }

        /* Stats */
        .analytics-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 28px;
        }
        .analytics-stat-card {
          background: #FFFFFF; border: 1px solid #E8D5C4;
          border-radius: 16px; padding: 20px; display: flex;
          align-items: center; gap: 16px; transition: border-color 0.2s;
        }
        .analytics-stat-card:hover { border-color: #FF6B35; }
        .analytics-stat-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .analytics-stat-value {
          font-size: 24px; font-weight: 800; color: #1A1A2E;
          margin: 0; font-family: 'Cabinet Grotesk', sans-serif;
        }
        .analytics-stat-label {
          font-size: 12px; color: #8B8B9E; margin: 2px 0 0 0;
          font-weight: 500;
        }

        /* Grid */
        .analytics-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        .analytics-right { display: flex; flex-direction: column; gap: 20px; }

        /* Cards */
        .analytics-card {
          background: #FFFFFF; border: 1px solid #E8D5C4;
          border-radius: 16px; padding: 24px;
        }
        .analytics-card-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 17px; font-weight: 700; color: #1A1A2E;
          margin: 0 0 20px 0; font-family: 'Cabinet Grotesk', sans-serif;
        }

        /* Skills */
        .analytics-skills { display: flex; flex-direction: column; gap: 16px; }
        .analytics-skill-header {
          display: flex; justify-content: space-between; margin-bottom: 4px;
        }
        .analytics-skill-name { font-size: 13px; font-weight: 600; color: #1A1A2E; }
        .analytics-skill-score { font-size: 13px; font-weight: 700; }
        .analytics-skill-bar {
          height: 8px; background: #F0EBE3; border-radius: 4px; overflow: hidden;
        }
        .analytics-skill-fill { height: 100%; border-radius: 4px; }
        .analytics-skill-meta {
          font-size: 11px; color: #8B8B9E; margin-top: 4px; text-align: right;
        }

        /* Weak Topics */
        .analytics-weak-list { display: flex; flex-direction: column; gap: 10px; }
        .analytics-weak-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          background: #FFFBF5; border: 1px solid #E8D5C4;
          font-size: 13px; font-weight: 500; color: #1A1A2E;
        }
        .analytics-weak-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }

        /* Recommendations */
        .analytics-rec-list { display: flex; flex-direction: column; gap: 10px; }
        .analytics-rec-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px; border-radius: 10px;
          background: #FFFBF5; border: 1px solid #E8D5C4;
          cursor: pointer; transition: border-color 0.2s;
        }
        .analytics-rec-item:hover { border-color: #FF6B35; }
        .analytics-rec-title { font-size: 13px; font-weight: 600; color: #1A1A2E; margin: 0; }
        .analytics-rec-reason { font-size: 11px; color: #8B8B9E; margin: 2px 0 0 0; }
        .analytics-empty {
          text-align: center; color: #8B8B9E; font-size: 13px; padding: 20px 0;
        }

        @media (max-width: 1023px) {
          .analytics-stats { grid-template-columns: repeat(2, 1fr); }
          .analytics-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          .analytics-header h2 { font-size: 22px; }
          .analytics-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
          .analytics-stat-card { padding: 14px; gap: 12px; }
          .analytics-stat-value { font-size: 20px; }
          .analytics-card { padding: 16px; }
        }
      `}</style>
    </>
  );
}
