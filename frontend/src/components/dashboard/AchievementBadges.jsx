import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { achievementApi } from "../../services/achievementApi";
import {
  Code2,
  Zap,
  Target,
  Swords,
  Crown,
  Trophy,
  Flame,
  MessageSquare,
  Brain,
  Bug,
  Lightbulb,
  Search,
  Sparkles,
  Lock,
} from "lucide-react";

const iconMap = {
  Code2,
  Zap,
  Target,
  Swords,
  Crown,
  Trophy,
  Flame,
  MessageSquare,
  Brain,
  Bug,
  Lightbulb,
  Search,
  Sparkles,
};

export default function AchievementBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const data = await achievementApi.getAll();
      setBadges(data || []);
    } catch (error) {
      console.error("Failed to load badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors = {
    common: "#8B8B9E",
    uncommon: "#2ECC71",
    rare: "#3498DB",
    epic: "#9B59B6",
    legendary: "#FF6B35",
  };

  const rarityBg = {
    common: "#F5F5F5",
    uncommon: "#E8F8F0",
    rare: "#EBF5FB",
    epic: "#F4ECF7",
    legendary: "#FFF3E8",
  };

  if (loading) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div>
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
          <Trophy size={20} color="#FF6B35" />
          Achievements
        </h3>
        <span style={{ fontSize: 12, color: "#8B8B9E", fontWeight: 600 }}>
          {unlockedCount}/{badges.length} unlocked
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 10,
        }}
      >
        {badges.map((badge, index) => {
          const IconComp = iconMap[badge.icon] || Trophy;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              style={{
                padding: "14px 10px",
                borderRadius: 12,
                border: badge.unlocked
                  ? `2px solid ${badge.color}`
                  : "1px solid #E8D5C4",
                backgroundColor: badge.unlocked
                  ? rarityBg[badge.rarity] || "#FFFBF5"
                  : "#FAFAFA",
                textAlign: "center",
                cursor: badge.unlocked ? "pointer" : "default",
                transition: "all 0.2s",
                opacity: badge.unlocked ? 1 : 0.5,
                filter: badge.unlocked ? "none" : "grayscale(100%)",
              }}
              onMouseEnter={(e) => {
                if (badge.unlocked) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              title={
                badge.unlocked
                  ? `${badge.title}: ${badge.description}`
                  : "Locked"
              }
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: badge.unlocked
                    ? badge.color + "20"
                    : "#E8D5C4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}
              >
                {badge.unlocked ? (
                  <IconComp size={20} color={badge.color} />
                ) : (
                  <Lock size={16} color="#8B8B9E" />
                )}
              </div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: badge.unlocked ? "#1A1A2E" : "#8B8B9E",
                  margin: "0 0 2px 0",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
              >
                {badge.unlocked ? badge.title : "???"}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "#8B8B9E",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {badge.unlocked ? badge.description : "Keep going!"}
              </p>
              {badge.unlocked && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 9,
                    fontWeight: 600,
                    color: rarityColors[badge.rarity],
                    background: rarityBg[badge.rarity],
                    padding: "2px 8px",
                    borderRadius: 10,
                    textTransform: "uppercase",
                  }}
                >
                  {badge.rarity}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
