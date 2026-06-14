import express from "express";

const router = express.Router();
import {
  trackProgress,
  getProgress,
  getHistory,
  getAnalytics,
} from "../controllers/progressController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/track", protect, trackProgress);
router.get("/", protect, getProgress);
router.get("/history", protect, getHistory);
router.get("/analytics", protect, getAnalytics);

export default router;
