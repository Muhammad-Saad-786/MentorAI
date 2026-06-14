import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import { getUserAchievements } from "../services/achievementService.js";

// GET /api/achievements
router.get("/", protect, async (req, res) => {
  try {
    const achievements = await getUserAchievements(req.user._id);
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Failed to get achievements" });
  }
});

export default router;
