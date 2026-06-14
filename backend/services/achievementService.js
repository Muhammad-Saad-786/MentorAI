import Achievement from "../models/Achievement.js";
import Progress from "../models/Progress.js";
import ChatSession from "../models/ChatSession.js";
import { createNotification } from "./notificationService.js";

const BADGES = {
  first_problem: {
    id: "first_problem",
    title: "First Steps",
    description: "Solve your first problem",
    icon: "Code2",
    color: "#2ECC71",
    rarity: "common",
  },
  five_problems: {
    id: "five_problems",
    title: "Getting Started",
    description: "Solve 5 problems",
    icon: "Zap",
    color: "#3498DB",
    rarity: "common",
  },
  ten_problems: {
    id: "ten_problems",
    title: "Problem Solver",
    description: "Solve 10 problems",
    icon: "Target",
    color: "#F39C12",
    rarity: "uncommon",
  },
  twenty_five: {
    id: "twenty_five",
    title: "Code Warrior",
    description: "Solve 25 problems",
    icon: "Swords",
    color: "#E74C3C",
    rarity: "rare",
  },
  fifty_problems: {
    id: "fifty_problems",
    title: "Algorithm Master",
    description: "Solve 50 problems",
    icon: "Crown",
    color: "#9B59B6",
    rarity: "epic",
  },
  hundred_problems: {
    id: "hundred_problems",
    title: "Century Club",
    description: "Solve 100 problems",
    icon: "Trophy",
    color: "#FF6B35",
    rarity: "legendary",
  },

  streak_3: {
    id: "streak_3",
    title: "Consistent",
    description: "3-day coding streak",
    icon: "Flame",
    color: "#F39C12",
    rarity: "common",
  },
  streak_7: {
    id: "streak_7",
    title: "On Fire",
    description: "7-day coding streak",
    icon: "Flame",
    color: "#E74C3C",
    rarity: "uncommon",
  },
  streak_14: {
    id: "streak_14",
    title: "Unstoppable",
    description: "14-day coding streak",
    icon: "Flame",
    color: "#FF6B35",
    rarity: "rare",
  },
  streak_30: {
    id: "streak_30",
    title: "Dedicated",
    description: "30-day coding streak",
    icon: "Flame",
    color: "#9B59B6",
    rarity: "epic",
  },

  first_chat: {
    id: "first_chat",
    title: "Hello Mentor",
    description: "Start your first AI mentor chat",
    icon: "MessageSquare",
    color: "#3498DB",
    rarity: "common",
  },
  ten_chats: {
    id: "ten_chats",
    title: "Curious Mind",
    description: "Send 10 messages to the AI mentor",
    icon: "Brain",
    color: "#F39C12",
    rarity: "uncommon",
  },

  debug_master: {
    id: "debug_master",
    title: "Bug Hunter",
    description: "Use debug mode 5 times",
    icon: "Bug",
    color: "#E74C3C",
    rarity: "uncommon",
  },
  socratic_scholar: {
    id: "socratic_scholar",
    title: "Deep Thinker",
    description: "Use Socratic mode 5 times",
    icon: "Lightbulb",
    color: "#F39C12",
    rarity: "uncommon",
  },
  review_pro: {
    id: "review_pro",
    title: "Code Reviewer",
    description: "Get 5 AI code reviews",
    icon: "Search",
    color: "#2ECC71",
    rarity: "uncommon",
  },

  first_review: {
    id: "first_review",
    title: "Second Opinion",
    description: "Get your first AI code review",
    icon: "Sparkles",
    color: "#FF6B35",
    rarity: "common",
  },
};

export { BADGES };

// Award a single badge
async function awardBadge(userId, badgeId) {
  const badge = BADGES[badgeId];
  if (!badge) return null;

  // Check if already unlocked
  const existing = await Achievement.findOne({ userId, badgeId });
  if (existing) return null;

  await Achievement.create({ userId, badgeId });

  await createNotification(
    userId,
    "achievement",
    `🏆 ${badge.title}`,
    badge.description,
    badge.icon,
    "/dashboard",
    { badge },
  );

  return badge;
}

// Check only problem/streak badges
export async function checkProblemAchievements(userId) {
  const progress = await Progress.findOne({ userId });
  if (!progress) return [];

  const newBadges = [];
  const problemBadges = [
    "first_problem",
    "five_problems",
    "ten_problems",
    "twenty_five",
    "fifty_problems",
    "hundred_problems",
  ];
  const streakBadges = ["streak_3", "streak_7", "streak_14", "streak_30"];

  // Problem badges
  const problemChecks = [
    { id: "first_problem", condition: progress.totalSolved >= 1 },
    { id: "five_problems", condition: progress.totalSolved >= 5 },
    { id: "ten_problems", condition: progress.totalSolved >= 10 },
    { id: "twenty_five", condition: progress.totalSolved >= 25 },
    { id: "fifty_problems", condition: progress.totalSolved >= 50 },
    { id: "hundred_problems", condition: progress.totalSolved >= 100 },
  ];

  for (const check of problemChecks) {
    if (check.condition) {
      const badge = await awardBadge(userId, check.id);
      if (badge) newBadges.push(badge);
    }
  }

  // Streak badges
  const streakChecks = [
    { id: "streak_3", condition: progress.currentStreak >= 3 },
    { id: "streak_7", condition: progress.currentStreak >= 7 },
    { id: "streak_14", condition: progress.currentStreak >= 14 },
    { id: "streak_30", condition: progress.currentStreak >= 30 },
  ];

  for (const check of streakChecks) {
    if (check.condition) {
      const badge = await awardBadge(userId, check.id);
      if (badge) newBadges.push(badge);
    }
  }

  return newBadges;
}

// Check only chat badges
export async function checkChatAchievements(userId) {
  const allSessions = await ChatSession.find({ userId, isActive: true });

  // Count sessions with actual conversation
  const activeChats = allSessions.filter((s) => s.messages.length >= 2);

  // Count total messages
  let totalMessages = 0;
  let debugCount = 0;
  let socraticCount = 0;

  for (const session of activeChats) {
    totalMessages += session.messages.length;
    if (session.mode === "debug") debugCount++;
    if (session.mode === "socratic") socraticCount++;
  }

  const newBadges = [];

  const checks = [
    { id: "first_chat", condition: activeChats.length >= 1 },
    { id: "ten_chats", condition: totalMessages >= 10 },
    { id: "debug_master", condition: debugCount >= 5 },
    { id: "socratic_scholar", condition: socraticCount >= 5 },
  ];

  for (const check of checks) {
    if (check.condition) {
      const badge = await awardBadge(userId, check.id);
      if (badge) newBadges.push(badge);
    }
  }

  return newBadges;
}

// Check only review badges
export async function checkReviewAchievements(userId) {
  const reviewSessions = await ChatSession.find({
    userId,
    mode: "review",
    isActive: true,
  });
  const reviewCount = reviewSessions.filter(
    (s) => s.messages.length >= 2,
  ).length;

  const newBadges = [];

  if (reviewCount >= 1) {
    const badge = await awardBadge(userId, "first_review");
    if (badge) newBadges.push(badge);
  }
  if (reviewCount >= 5) {
    const badge = await awardBadge(userId, "review_pro");
    if (badge) newBadges.push(badge);
  }

  return newBadges;
}

export async function getUserAchievements(userId) {
  const unlocked = await Achievement.find({ userId });
  const unlockedIds = unlocked.map((a) => a.badgeId);

  return Object.values(BADGES).map((badge) => ({
    ...badge,
    unlocked: unlockedIds.includes(badge.id),
    unlockedAt:
      unlocked.find((a) => a.badgeId === badge.id)?.unlockedAt || null,
  }));
}
