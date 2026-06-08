import express from "express";
const router = express.Router();
import {
  sendMessage,
  getSessions,
  getSession,
  deleteSession,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/chat", protect, sendMessage);
router.get("/sessions", protect, getSessions);
router.get("/sessions/:id", protect, getSession);
router.delete("/sessions/:id", protect, deleteSession);

export default router;
