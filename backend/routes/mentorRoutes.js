import { Router } from "express";
import express from "express";
const router = express.Router();
import { getMentorResponse } from "../services/geminiService.js";

// POST /api/mentor/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await getMentorResponse(
      sessionId || "default",
      message,
      mode || "default",
    );

    res.json(result);
  } catch (error) {
    console.error("Mentor error:", error);
    res.status(500).json({
      error: "Failed to get mentor response",
      details: error.message,
    });
  }
});

// POST /api/mentor/debug
router.post("/debug", async (req, res) => {
  try {
    const { code, error, language, sessionId } = req.body;

    const message = `I'm debugging ${language} code. Here's my code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nI'm getting this error:\n\`\`\`\n${error}\n\`\`\`\n\nHelp me understand what's going wrong.`;

    const result = await getMentorResponse(
      sessionId || "debug-session",
      message,
      "debug",
    );

    res.json(result);
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Failed to analyze error" });
  }
});

// POST /api/mentor/review
router.post("/review", async (req, res) => {
  try {
    const { code, language, sessionId } = req.body;

    const message = `Please review my ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nWhat can I improve?`;

    const result = await getMentorResponse(
      sessionId || "review-session",
      message,
      "review",
    );

    res.json(result);
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ error: "Failed to review code" });
  }
});

// POST /api/mentor/hint
router.post("/hint", async (req, res) => {
  try {
    const { problem, currentCode, language, sessionId } = req.body;

    const message = `I'm working on this problem: "${problem}". Here's my current code:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n\nI'm stuck. Can you give me a hint?`;

    const result = await getMentorResponse(
      sessionId || "hint-session",
      message,
      "default",
    );

    res.json(result);
  } catch (error) {
    console.error("Hint error:", error);
    res.status(500).json({ error: "Failed to generate hint" });
  }
});

// GET /api/mentor/session/:sessionId
router.get("/session/:sessionId", (req, res) => {
  // Return session info (hint level, history length, etc.)
  // For now, just acknowledge
  res.json({
    sessionId: req.params.sessionId,
    message: "Session tracking will be implemented with database in Phase 4",
  });
});

// DELETE /api/mentor/session/:sessionId
router.delete("/session/:sessionId", (req, res) => {
  res.json({
    message: "Session cleared",
    sessionId: req.params.sessionId,
  });
});

export default router;
