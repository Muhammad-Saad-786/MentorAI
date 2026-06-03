import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";
import {
  Send,
  Sparkles,
  Bug,
  Code2,
  Lightbulb,
  Brain,
  User,
  RotateCcw,
  Copy,
  ThumbsUp,
} from "lucide-react";
import { mentorApi } from "../services/mentorApi";
import toast from "react-hot-toast";

const MODES = [
  { id: "default", label: "Mentor", icon: Brain },
  { id: "socratic", label: "Socratic", icon: Lightbulb },
  { id: "debug", label: "Debug", icon: Bug },
  { id: "review", label: "Review", icon: Code2 },
];

export default function Mentor() {
  const [messages, setMessages] = useState([
    {
      role: "mentor",
      content:
        "Hey there! 👋 I'm your AI coding mentor. I'm here to guide your thinking, not give you answers. What are you working on today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("default");
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await mentorApi.sendMessage(trimmed, sessionId, mode);
      setMessages((prev) => [
        ...prev,
        {
          role: "mentor",
          content: data.response,
          timestamp: Date.now(),
          hintLevel: data.hintLevel,
        },
      ]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error("Mentor error:", error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "mentor",
        content: "Chat cleared! What would you like to work on?",
        timestamp: Date.now(),
      },
    ]);
    toast.success("Chat cleared");
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mentor-page"
      >
        {/* Header */}
        <div className="mentor-header">
          <div>
            <h2 className="mentor-title">AI Mentor</h2>
            <p className="mentor-subtitle">
              Your personal coding guide — asks questions, never just answers
            </p>
          </div>
          <button className="mentor-clear-btn" onClick={handleClearChat}>
            <RotateCcw size={16} />
            <span className="mentor-clear-label">Clear Chat</span>
          </button>
        </div>

        {/* Mode Selector */}
        <div className="mentor-modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                toast.success(`Switched to ${m.label} mode`);
              }}
              className={`mentor-mode-btn ${mode === m.id ? "active" : ""}`}
            >
              <m.icon size={18} />
              <span className="mentor-mode-label">{m.label}</span>
              {mode === m.id && (
                <span className="mentor-mode-badge">ACTIVE</span>
              )}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="mentor-chat">
          {/* Messages */}
          <div className="mentor-messages">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mentor-msg-row ${msg.role}`}
                >
                  {msg.role === "mentor" && (
                    <div className="mentor-avatar mentor-avatar-ai">
                      <Sparkles size={18} color="#FF6B35" />
                    </div>
                  )}

                  <div className="mentor-msg-content">
                    <div className={`mentor-bubble ${msg.role}`}>
                      <MarkdownRenderer
                        content={msg.content}
                        isUser={msg.role === "user"}
                      />
                      {msg.hintLevel && (
                        <div className="mentor-hint">
                          <span className="mentor-hint-text">
                            Hint Level: {msg.hintLevel}/5
                          </span>
                          <div className="mentor-hint-bar">
                            <div
                              className="mentor-hint-fill"
                              style={{
                                width: `${(msg.hintLevel / 5) * 100}%`,
                                backgroundColor:
                                  msg.hintLevel <= 2
                                    ? "#2ECC71"
                                    : msg.hintLevel <= 4
                                      ? "#F39C12"
                                      : "#E74C3C",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.role === "mentor" && (
                      <div className="mentor-msg-actions">
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className="mentor-action-btn"
                        >
                          <Copy size={14} />
                        </button>
                        <button className="mentor-action-btn">
                          <ThumbsUp size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="mentor-avatar mentor-avatar-user">
                      <User size={18} color="#FFFFFF" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mentor-loading"
              >
                <div className="mentor-avatar mentor-avatar-ai">
                  <Sparkles size={18} color="#FF6B35" />
                </div>
                <div className="mentor-loading-dots">
                  <div />
                  <div />
                  <div />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mentor-input-area">
            <div className="mentor-input-row">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === "socratic"
                    ? "Ask a question..."
                    : mode === "debug"
                      ? "Paste your code and error message..."
                      : mode === "review"
                        ? "Paste your code for review..."
                        : "Ask your coding mentor anything..."
                }
                rows={1}
                className="mentor-textarea"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="mentor-send-btn"
                style={{
                  backgroundColor:
                    isLoading || !input.trim() ? "#E8D5C4" : "#FF6B35",
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        /* ========== BASE ========== */
        .mentor-page {
          height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
        }
        .mentor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-shrink: 0;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mentor-title {
          font-size: 28px;
          font-weight: 800;
          color: #1A1A2E;
          margin: 0 0 4px 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .mentor-subtitle {
          font-size: 14px;
          color: #5C5C6E;
          margin: 0;
        }
        .mentor-clear-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #E8D5C4;
          background: #FFFFFF;
          color: #5C5C6E;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .mentor-clear-btn:hover { background: #FFF5F5; color: #E74C3C; border-color: #E74C3C; }

        /* Modes */
        .mentor-modes {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .mentor-mode-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid #E8D5C4;
          background: #FFFFFF;
          color: #5C5C6E;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .mentor-mode-btn:hover { border-color: #FF6B35; background: #FFFBF5; }
        .mentor-mode-btn.active { border: 2px solid #FF6B35; background: #FFF3E8; color: #FF6B35; }
        .mentor-mode-badge {
          font-size: 10px;
          background: #FF6B35;
          color: #FFFFFF;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        /* Chat */
        .mentor-chat {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid #E8D5C4;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .mentor-messages {
          flex: 1;
          overflow: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Message Row */
        .mentor-msg-row {
          display: flex;
          gap: 12px;
          max-width: 75%;
        }
        .mentor-msg-row.user { align-self: flex-end; }
        .mentor-msg-row.mentor { align-self: flex-start; }
        .mentor-msg-content { min-width: 0; }

        /* Avatars */
        .mentor-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mentor-avatar-ai { background: #FFF3E8; }
        .mentor-avatar-user { background: #FF6B35; }

        /* Bubbles */
        .mentor-bubble {
          padding: 14px 18px;
          font-size: 14px;
          line-height: 1.7;
          font-family: 'Inter', sans-serif;
          word-break: break-word;
        }
        .mentor-bubble.user {
          border-radius: 16px 16px 4px 16px;
          background: #FF6B35;
          color: #FFFFFF;
        }
        .mentor-bubble.mentor {
          border-radius: 16px 16px 16px 4px;
          background: #FFFBF5;
          color: #1A1A2E;
          border: 1px solid #E8D5C4;
        }

        /* Hint */
        .mentor-hint {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mentor-hint-text { font-size: 10px; color: #8B8B9E; font-weight: 600; white-space: nowrap; }
        .mentor-hint-bar { flex: 1; height: 3px; background: #E8D5C4; border-radius: 2px; max-width: 60px; }
        .mentor-hint-fill { height: 100%; border-radius: 2px; }

        /* Message Actions */
        .mentor-msg-actions { display: flex; gap: 8px; margin-top: 4px; padding-left: 4px; }
        .mentor-action-btn {
          background: none; border: none; color: #8B8B9E; cursor: pointer;
          padding: 2px; border-radius: 4px; transition: color 0.2s;
        }
        .mentor-action-btn:hover { color: #FF6B35; }

        /* Loading */
        .mentor-loading { display: flex; gap: 12px; align-items: center; }
        .mentor-loading-dots {
          padding: 14px 18px;
          border-radius: 16px 16px 16px 4px;
          background: #FFFBF5;
          border: 1px solid #E8D5C4;
          display: flex;
          gap: 6px;
        }
        .mentor-loading-dots div {
          width: 8px; height: 8px; border-radius: 50%; background: #FF6B35;
          animation: mentorDotPulse 1.2s infinite;
        }
        .mentor-loading-dots div:nth-child(2) { animation-delay: 0.2s; }
        .mentor-loading-dots div:nth-child(3) { animation-delay: 0.4s; }
        @keyframes mentorDotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Input */
        .mentor-input-area {
          padding: 16px 24px;
          border-top: 1px solid #E8D5C4;
          background: #FFFBF5;
          flex-shrink: 0;
        }
        .mentor-input-row { display: flex; gap: 12px; align-items: center; }
        .mentor-textarea {
          flex: 1;
          resize: none;
          background: #FFFFFF;
          border: 2px solid #E8D5C4;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: #1A1A2E;
          outline: none;
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          max-height: 120px;
          box-shadow: none;
          transition: border-color 0.25s;
        }
        .mentor-textarea:focus { border-color: #FF6B35; }
        .mentor-send-btn {
          width: 48px; height: 48px; min-width: 48px; min-height: 48px;
          border-radius: 12px; border: none; color: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; cursor: pointer; transition: background-color 0.2s;
        }
        .mentor-send-btn:hover:not(:disabled) { background-color: #E55A2B !important; }
        .mentor-input-hint {
          font-size: 11px; color: #8B8B9E; margin: 8px 0 0 0; text-align: center;
        }

        /* ========== TABLET ========== */
        @media (max-width: 1023px) {
          .mentor-page { height: calc(100vh - 120px); }
          .mentor-title { font-size: 24px; }
          .mentor-msg-row { max-width: 85%; }
          .mentor-messages { padding: 16px; }
          .mentor-input-area { padding: 12px 16px; }
        }

        /* ========== MOBILE ========== */
        @media (max-width: 767px) {
          .mentor-page {
            height: auto;
            min-height: calc(100vh - 140px);
            padding-bottom: 70px;
          }
          .mentor-title { font-size: 20px; }
          .mentor-subtitle { font-size: 12px; display: none; }
          .mentor-clear-label { display: none; }
          .mentor-clear-btn { padding: 8px 12px; }
          .mentor-modes { gap: 6px; margin-bottom: 12px; }
          .mentor-mode-btn { padding: 8px 12px; font-size: 12px; gap: 6px; }
          .mentor-mode-label { display: none; }
          .mentor-mode-badge { display: none; }
          .mentor-chat { border-radius: 12px; }
          .mentor-messages { padding: 12px; gap: 10px; }
          .mentor-msg-row { max-width: 92%; }
          .mentor-bubble { padding: 10px 14px; font-size: 13px; }
          .mentor-avatar { width: 30px; height: 30px; border-radius: 8px; }
          .mentor-avatar svg { width: 16px; height: 16px; }
          .mentor-input-area { padding: 10px 12px; }
          .mentor-input-row { gap: 8px; }
          .mentor-textarea { padding: 10px 12px; font-size: 13px; }
          .mentor-send-btn { width: 42px; height: 42px; min-width: 42px; min-height: 42px; }
          .mentor-input-hint { font-size: 10px; margin-top: 6px; }
        }
      `}</style>
    </>
  );
}
