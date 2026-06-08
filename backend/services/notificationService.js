import Notification from "../models/Notification.js";

export async function createNotification(
  userId,
  type,
  title,
  message,
  icon = "Bell",
  link = null,
  metadata = {},
) {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      icon,
      link,
      metadata,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
}

// Check and award streak notifications
export async function checkStreakMilestones(userId, currentStreak) {
  const milestones = [3, 7, 14, 30, 60, 100];
  for (const milestone of milestones) {
    if (currentStreak === milestone) {
      await createNotification(
        userId,
        "streak",
        `🔥 ${milestone} Day Streak!`,
        `You've been coding for ${milestone} days in a row! Keep the momentum going.`,
        "Flame",
        "/dashboard",
      );
    }
  }
}

// Check problem solved milestones
export async function checkProblemMilestones(userId, totalSolved) {
  const milestones = [1, 5, 10, 25, 50, 100];
  for (const milestone of milestones) {
    if (totalSolved === milestone) {
      await createNotification(
        userId,
        "achievement",
        `🏆 ${milestone} Problems Solved!`,
        `You've solved ${milestone} problems. You're making great progress!`,
        "Trophy",
        "/analytics",
      );
    }
  }
}

// Notify on mentor reply
export async function notifyMentorReply(userId, messagePreview) {
  await createNotification(
    userId,
    "mentor_reply",
    "💬 New Mentor Reply",
    messagePreview.substring(0, 100) +
      (messagePreview.length > 100 ? "..." : ""),
    "MessageSquare",
    "/mentor",
  );
}
