import ChatSession from "../models/ChatSession.js";
import { getMentorResponse } from "../services/geminiService.js";

// POST /api/mentor/chat
export const sendMessage = async (req, res) => {
  try {
    const { message, mode, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chatSession = null;

    // Try to find existing session
    if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
      try {
        chatSession = await ChatSession.findOne({
          _id: sessionId,
          userId: req.user._id,
          isActive: true,
        });
      } catch (e) {
        // Invalid ID, will create new session
      }
    }

    // Create new session if needed
    if (!chatSession) {
      chatSession = new ChatSession({
        userId: req.user._id,
        mode: mode || "default",
        messages: [],
        hintLevel: 1,
      });
      await chatSession.save();
    }

    // Update mode if changed
    if (mode && mode !== chatSession.mode) {
      chatSession.mode = mode;
    }

    // Add user message
    chatSession.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Get AI response
    const aiResult = await getMentorResponse(
      chatSession._id.toString(),
      message,
      chatSession.mode,
    );

    // Add AI response
    chatSession.messages.push({
      role: "mentor",
      content: aiResult.response,
      timestamp: new Date(),
      hintLevel: aiResult.hintLevel,
    });

    // Update session metadata
    chatSession.hintLevel = aiResult.hintLevel;
    chatSession.updatedAt = new Date();
    await chatSession.save();

    // Try to send notification (don't fail if it errors)
    try {
      const { notifyMentorReply } =
        await import("../services/notificationService.js");
      await notifyMentorReply(req.user._id, aiResult.response);
    } catch (notifError) {
      console.error("Notification error (non-fatal):", notifError.message);
    }

    res.json({
      response: aiResult.response,
      hintLevel: aiResult.hintLevel,
      mode: chatSession.mode,
      sessionId: chatSession._id,
      messageCount: chatSession.messages.length,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get mentor response" });
  }
};

// GET /api/mentor/sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({
      userId: req.user._id,
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .select("mode hintLevel messages createdAt updatedAt")
      .limit(20);

    const result = sessions.map((s) => ({
      _id: s._id,
      mode: s.mode,
      hintLevel: s.hintLevel,
      messageCount: s.messages.length,
      lastMessage:
        s.messages[s.messages.length - 1]?.content?.substring(0, 100) || "",
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get sessions" });
  }
};

// GET /api/mentor/sessions/:id
export const getSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to get session" });
  }
};

// DELETE /api/mentor/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
    );
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" });
  }
};
