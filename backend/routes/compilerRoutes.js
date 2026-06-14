import express from "express";
const router = express.Router();
import { getLanguageConfig } from "../services/judge0Service.js";
import { getMentorResponse } from "../services/geminiService.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/run", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    const config = getLanguageConfig(language);

    if (!config) {
      return res
        .status(400)
        .json({ error: `Unsupported language: ${language}` });
    }

    // If browser-executable, tell the frontend to handle it
    if (config.canExecuteInBrowser) {
      return res.json({
        output: null,
        executeInBrowser: true,
        language,
        status: "browser",
      });
    }

    // For non-browser languages, return a helpful message
    return res.json({
      output: `Direct execution for ${language} is not available in the browser.\n\nSupported browser languages: JavaScript, Python\n\nFor ${language}, you can install a local compiler or we'll add server-side execution soon.`,
      executeInBrowser: false,
      language,
      status: "info",
    });
  } catch (error) {
    console.error("Compiler error:", error.message);
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/review", protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    const reviewMessage = `Please review my ${language} code. Tell me what's good, what can be improved, and any bugs or edge cases I might have missed. Be specific but encouraging. Here's the code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

    const result = await getMentorResponse(
      `review-${req.user._id}`,
      reviewMessage,
      "review",
    );

    res.json({
      review: result.response,
      hintLevel: result.hintLevel,
    });
    try {
      const { checkReviewAchievements } =
        await import("../services/achievementService.js");
      await checkReviewAchievements(req.user._id);
    } catch (e) {
      console.error("Achievement check error:", e.message);
    }
  } catch (error) {
    console.error("Review error:", error.message);
    res.status(500).json({ error: "Failed to review code" });
  }
});

router.get("/languages", (req, res) => {
  const { getLanguageConfig } = require("../services/judge0Service.js");
  res.json({
    languages: [
      { id: "javascript", label: "JavaScript", browser: true },
      { id: "typescript", label: "TypeScript", browser: false },
      { id: "python", label: "Python", browser: true },
      { id: "java", label: "Java", browser: false },
      { id: "cpp", label: "C++", browser: false },
      { id: "go", label: "Go", browser: false },
      { id: "rust", label: "Rust", browser: false },
    ],
  });
});

export default router;
