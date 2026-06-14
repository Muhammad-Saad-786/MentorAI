import {
  checkStreakMilestones,
  checkProblemMilestones,
} from "../services/notificationService.js";
import Progress from "../models/Progress.js";
import CodeHistory from "../models/CodeHistory.js";

// Topic detection keywords
const TOPIC_KEYWORDS = {
  Variables: ["var", "let", "const", "=", "assignment"],
  Conditionals: ["if", "else", "switch", "?", "ternary"],
  Loops: ["for", "while", "loop", "forEach", "map", "iteration"],
  Functions: ["function", "=>", "return", "()", "callback", "parameter"],
  Arrays: ["[", "]", "array", "push", "pop", "filter", "reduce", "map"],
  Recursion: ["recursion", "recursive", "base case", "fibonacci", "factorial"],
  Sorting: ["sort", "bubble", "merge", "quick", "insertion"],
  "Dynamic Programming": ["dp", "memo", "cache", "dynamic", "tabulation"],
};

function detectTopics(code) {
  const codeLower = code.toLowerCase();
  const detected = [];
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => codeLower.includes(kw))) {
      detected.push(topic);
    }
  }
  return detected;
}

// POST /api/progress/track
export const trackProgress = async (req, res) => {
  try {
    const { code, language, status, problemTitle } = req.body;

    // Save code history
    await new CodeHistory({
      userId: req.user._id,
      language: language || "javascript",
      sourceCode: code || "",
      status: status || "attempted",
      problemTitle: problemTitle || "",
    }).save();

    // Find or create progress
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = new Progress({ userId: req.user._id });
    }

    // Detect topics
    const detectedTopics = detectTopics(code || "");

    // Update topic scores
    for (const topic of detectedTopics) {
      let topicEntry = progress.topics.find((t) => t.name === topic);
      if (!topicEntry) {
        topicEntry = { name: topic, score: 0, attempts: 0, solved: 0 };
        progress.topics.push(topicEntry);
      }
      topicEntry.attempts += 1;
      if (status === "solved") {
        topicEntry.solved += 1;
        topicEntry.score = Math.min(topicEntry.score + 10, 100);
      }
      topicEntry.lastAttempted = new Date();
    }

    // Update totals
    progress.totalAttempts += 1;
    if (status === "solved") progress.totalSolved += 1;
    progress.lastActive = new Date();

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = progress.lastActive
      ? new Date(progress.lastActive)
      : null;

    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already active today
      } else if (diffDays === 1) {
        progress.currentStreak += 1;
      } else {
        progress.currentStreak = 1;
      }
    } else {
      progress.currentStreak = 1;
    }

    progress.bestStreak = Math.max(progress.bestStreak, progress.currentStreak);
    await progress.save();
    // Save badge
    try {
      const { checkProblemAchievements } =
        await import("../services/achievementService.js");
      await checkProblemAchievements(req.user._id);
    } catch (e) {
      console.error("Achievement check error:", e.message);
    }

    // Try to create notifications (don't fail if notification service errors)
    try {
      const { checkStreakMilestones, checkProblemMilestones } =
        await import("../services/notificationService.js");
      await checkStreakMilestones(req.user._id, progress.currentStreak);
      await checkProblemMilestones(req.user._id, progress.totalSolved);
    } catch (notifError) {
      console.error("Notification error (non-fatal):", notifError.message);
    }

    res.json({
      message: "Progress tracked",
      currentStreak: progress.currentStreak,
      totalSolved: progress.totalSolved,
    });
  } catch (error) {
    console.error("Track error:", error.message);
    res.status(500).json({ error: "Failed to track progress" });
  }
};

// GET /api/progress
export const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = new Progress({ userId: req.user._id });
      await progress.save();
    }

    const recentHistory = await CodeHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const weakTopics = progress.topics
      .filter((t) => t.score < 50)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    const skillTree = {
      Variables: ["Conditionals", "Loops"],
      Loops: ["Functions", "Arrays"],
      Functions: ["Recursion"],
      Arrays: ["Sorting"],
      Recursion: ["Dynamic Programming"],
    };

    const strongTopics = progress.topics
      .filter((t) => t.score >= 50)
      .map((t) => t.name);
    const recommendations = [];

    for (const topic of strongTopics) {
      const children = skillTree[topic] || [];
      for (const child of children) {
        if (
          !strongTopics.includes(child) &&
          !recommendations.find((r) => r.topic === child)
        ) {
          recommendations.push({ topic: child, reason: "Prerequisites met" });
        }
      }
    }

    res.json({
      totalAttempts: progress.totalAttempts,
      totalSolved: progress.totalSolved,
      currentStreak: progress.currentStreak,
      bestStreak: progress.bestStreak,
      topics: progress.topics.sort((a, b) => b.score - a.score),
      weakTopics,
      recommendations: recommendations.slice(0, 5),
      recentActivity: recentHistory.map((h) => ({
        title: h.problemTitle || `${h.language} code ${h.status}`,
        language: h.language,
        status: h.status,
        time: h.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get progress error:", error.message);
    res.status(500).json({ error: "Failed to get progress" });
  }
};

// GET /api/progress/history
export const getHistory = async (req, res) => {
  try {
    const history = await CodeHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to get history" });
  }
};

// GET /api/progress/analytics — Get detailed analytics
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all code history
    const history = await CodeHistory.find({ userId }).sort({ createdAt: 1 });

    // Daily activity (last 30 days)
    const dailyActivity = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyActivity[key] = { date: key, solved: 0, attempted: 0, failed: 0 };
    }

    history.forEach((h) => {
      const key = new Date(h.createdAt).toISOString().split("T")[0];
      if (dailyActivity[key]) {
        if (h.status === "solved") dailyActivity[key].solved++;
        else if (h.status === "failed") dailyActivity[key].failed++;
        else dailyActivity[key].attempted++;
      }
    });

    // Language distribution
    const languageStats = {};
    history.forEach((h) => {
      if (!languageStats[h.language]) languageStats[h.language] = 0;
      languageStats[h.language]++;
    });

    // Topic distribution (from progress)
    const progress = await Progress.findOne({ userId });
    const topicStats = (progress?.topics || []).map((t) => ({
      name: t.name,
      score: t.score,
      solved: t.solved,
      attempts: t.attempts,
    }));

    // Weekly summary
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekHistory = history.filter((h) => {
        const d = new Date(h.createdAt);
        return d >= weekStart && d < weekEnd;
      });

      weeklyData.push({
        week: `Week ${4 - i}`,
        solved: weekHistory.filter((h) => h.status === "solved").length,
        attempted: weekHistory.filter((h) => h.status !== "solved").length,
        total: weekHistory.length,
      });
    }

    // Totals
    const totalHistory = history.length;
    const solvedRate =
      totalHistory > 0
        ? Math.round(
            (history.filter((h) => h.status === "solved").length /
              totalHistory) *
              100,
          )
        : 0;

    res.json({
      dailyActivity: Object.values(dailyActivity),
      languageStats: Object.entries(languageStats).map(([name, value]) => ({
        name,
        value,
      })),
      topicStats,
      weeklyData,
      totals: {
        totalExecutions: totalHistory,
        totalSolved: progress?.totalSolved || 0,
        totalAttempts: progress?.totalAttempts || 0,
        solvedRate,
        currentStreak: progress?.currentStreak || 0,
        bestStreak: progress?.bestStreak || 0,
        totalTopics: topicStats.length,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ error: "Failed to get analytics" });
  }
};
