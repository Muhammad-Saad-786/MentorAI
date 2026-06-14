import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import {
  startInterview,
  continueInterview,
  getFeedback,
} from "../services/interviewService.js";

// POST /api/interview/start
router.post("/start", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const result = await startInterview(message || "");
    res.json(result);
  } catch (error) {
    console.error("Interview start error:", error.message);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

// POST /api/interview/continue
router.post("/continue", protect, async (req, res) => {
  try {
    const { history, message } = req.body;
    const response = await continueInterview(history, message);
    res.json({ message: response });
  } catch (error) {
    console.error("Interview continue error:", error.message);
    res.status(500).json({ error: "Failed to continue interview" });
  }
});

// POST /api/interview/feedback
router.post("/feedback", protect, async (req, res) => {
  try {
    const { history, solution } = req.body;
    const feedback = await getFeedback(history, solution);
    res.json({ feedback });
  } catch (error) {
    console.error("Feedback error:", error.message);
    res.status(500).json({ error: "Failed to get feedback" });
  }
});

export default router;
