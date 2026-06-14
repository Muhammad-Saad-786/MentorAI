import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";
import { interviewApi } from "../services/interviewApi";
import {
  Send,
  Sparkles,
  Clock,
  User,
  RotateCcw,
  Play,
  StopCircle,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Interview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [problem, setProblem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    // Scroll chat to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const result = await interviewApi.start("");
      setProblem(result.problem);
      setMessages([{ role: "interviewer", content: result.message }]);
      setIsActive(true);
      setFeedback(null);
      setHasAttempted(false);
      toast.success("Interview started!");
    } catch {
      toast.error("Failed to start");
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setHasAttempted(true);
    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const result = await interviewApi.continue(
        messages.concat(userMessage),
        trimmed,
      );
      setMessages((prev) => [
        ...prev,
        { role: "interviewer", content: result.message },
      ]);
    } catch {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleEnd = async () => {
    if (!hasAttempted) {
      toast.error("Try answering before ending the interview");
      return;
    }
    setIsLoading(true);
    setIsActive(false);
    try {
      const solution = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("\n\n");
      const result = await interviewApi.getFeedback(messages, solution);
      setFeedback(result.feedback);
      setMessages((prev) => [
        ...prev,
        { role: "interviewer", content: result.feedback },
      ]);
      toast.success("Feedback ready!");
    } catch {
      toast.error("Failed to get feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    setIsActive(false);
    setTimer(0);
    setProblem(null);
    setFeedback(null);
    setHasAttempted(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="interview-root">
      {/* Header */}
      <div className="interview-header">
        <div>
          <h2>Coding Interview</h2>
          <p>Practice with an AI interviewer</p>
        </div>
        <div className="interview-header-actions">
          {isActive && (
            <div className="interview-timer">
              <Clock size={16} color="#FF6B35" />
              {formatTime(timer)}
            </div>
          )}
          {!isActive && !feedback && (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="interview-btn interview-btn-start"
            >
              <Play size={18} /> {isLoading ? "Starting..." : "Start Interview"}
            </button>
          )}
          {isActive && (
            <button
              onClick={handleEnd}
              className="interview-btn interview-btn-end"
            >
              <StopCircle size={18} /> End & Feedback
            </button>
          )}
          <button
            onClick={handleReset}
            className="interview-btn interview-btn-reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Problem Card */}
      {problem && (
        <div className="interview-problem">
          <div className="interview-problem-top">
            <Trophy size={18} color="#FF6B35" />
            <span className="interview-problem-title">{problem.title}</span>
            <span className="interview-problem-diff">{problem.difficulty}</span>
            <span className="interview-problem-topic">{problem.topic}</span>
          </div>
          <p className="interview-problem-desc">{problem.description}</p>
          <div className="interview-problem-example">
            <p className="interview-problem-example-label">Example</p>
            <pre>{problem.example}</pre>
          </div>
        </div>
      )}

      {/* Chat + Input Card */}
      <div className="interview-card">
        {/* Scrollable messages */}
        <div className="interview-messages" ref={chatContainerRef}>
          {messages.length === 0 && !isLoading && (
            <div className="interview-empty">
              <Trophy size={56} color="#E8D5C4" />
              <p className="interview-empty-title">
                Ready for a Mock Interview?
              </p>
              <p className="interview-empty-sub">
                Click <strong>Start Interview</strong> to begin
              </p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`interview-msg ${msg.role}`}
              >
                {msg.role === "interviewer" && (
                  <div className="interview-avatar interview-avatar-ai">
                    <Sparkles size={16} color="#FF6B35" />
                  </div>
                )}
                <div className={`interview-bubble ${msg.role}`}>
                  <MarkdownRenderer
                    content={msg.content}
                    isUser={msg.role === "user"}
                  />
                </div>
                {msg.role === "user" && (
                  <div className="interview-avatar interview-avatar-user">
                    <User size={16} color="#FFFFFF" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="interview-loading">
              <div className="interview-avatar interview-avatar-ai">
                <Sparkles size={16} color="#FF6B35" />
              </div>
              <div className="interview-loading-dots">
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input — pinned to bottom */}
        {isActive && (
          <div className="interview-input-bar">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your solution or explain your approach..."
              rows={1}
              className="interview-textarea"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 80) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="interview-send-btn"
              style={{
                background: isLoading || !input.trim() ? "#E8D5C4" : "#FF6B35",
              }}
            >
              <Send size={18} />
            </button>
          </div>
        )}

        {!isActive && feedback && (
          <div className="interview-done-bar">
            <span> Interview complete</span>
            <button onClick={handleReset}>Start New</button>
          </div>
        )}
      </div>

      <style>{`
        .interview-root { display: flex; flex-direction: column; height: calc(100vh - 100px); padding-bottom: 80px; }
        
        /* Header */
        .interview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-shrink: 0; flex-wrap: wrap; gap: 12px; }
        .interview-header h2 { font-size: clamp(20px, 3vw, 26px); font-weight: 800; color: #1A1A2E; margin: 0 0 2px 0; font-family: 'Cabinet Grotesk', sans-serif; }
        .interview-header p { font-size: 13px; color: #5C5C6E; margin: 0; }
        .interview-header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .interview-timer { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; background: #FFF3E8; border: 1px solid #FF6B35; font-size: 15px; font-weight: 700; color: #FF6B35; font-family: 'JetBrains Mono', monospace; }
        .interview-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .interview-btn-start { background: #2ECC71; color: #FFFFFF; } .interview-btn-start:hover { background: #27AE60; }
        .interview-btn-end { background: #E74C3C; color: #FFFFFF; } .interview-btn-end:hover { background: #C0392B; }
        .interview-btn-reset { background: #FFFFFF; color: #5C5C6E; border: 1px solid #E8D5C4 !important; padding: 10px 14px; } .interview-btn-reset:hover { background: #FFFBF5; }

        /* Problem */
        .interview-problem { margin-bottom: 16px; flex-shrink: 0; background: #FFF3E8; border: 1px solid #FF6B35; border-radius: 14px; padding: 16px 18px; }
        .interview-problem-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
        .interview-problem-title { font-size: 15px; font-weight: 700; color: #1A1A2E; font-family: 'Cabinet Grotesk', sans-serif; }
        .interview-problem-diff { font-size: 11px; background: #FF6B35; color: #FFFFFF; padding: 2px 8px; border-radius: 20px; font-weight: 700; }
        .interview-problem-topic { font-size: 11px; color: #8B8B9E; font-weight: 500; }
        .interview-problem-desc { font-size: 13px; color: #5C5C6E; margin: 0 0 10px 0; line-height: 1.5; }
        .interview-problem-example { background: #2C2C3A; border-radius: 8px; padding: 10px 14px; }
        .interview-problem-example-label { font-size: 10px; font-weight: 700; color: #8B8B9E; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px; }
        .interview-problem-example pre { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #2ECC71; margin: 0; white-space: pre-wrap; line-height: 1.6; }

        /* Card */
        .interview-card { flex: 1; display: flex; flex-direction: column; min-height: 0; background: #FFFFFF; border: 1px solid #E8D5C4; border-radius: 16px; overflow: hidden; }
        .interview-messages { flex: 1; overflow-y: auto; padding: 20px; }
        .interview-empty { text-align: center; padding: 50px 20px; color: #8B8B9E; }
        .interview-empty-title { font-size: 17px; font-weight: 700; margin: 12px 0 4px; color: #1A1A2E; font-family: 'Cabinet Grotesk', sans-serif; }
        .interview-empty-sub { font-size: 14px; margin: 0; }

        .interview-msg { display: flex; gap: 10px; max-width: 82%; margin-bottom: 2px; }
        .interview-msg.user { align-self: flex-end; }
        .interview-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .interview-avatar-ai { background: #FFF3E8; } .interview-avatar-user { background: #FF6B35; }
        .interview-bubble { padding: 12px 16px; font-size: 13px; line-height: 1.6; font-family: 'Inter', sans-serif; word-break: break-word; }
        .interview-bubble.user { border-radius: 14px 14px 4px 14px; background: #FF6B35; color: #FFFFFF; }
        .interview-bubble.interviewer { border-radius: 14px 14px 14px 4px; background: #FFFBF5; color: #1A1A2E; border: 1px solid #E8D5C4; }
        .interview-loading { display: flex; gap: 10px; }
        .interview-loading-dots { padding: 12px 16px; border-radius: 14px 14px 14px 4px; background: #FFFBF5; border: 1px solid #E8D5C4; display: flex; gap: 5px; align-items: center; }
        .interview-loading-dots div { width: 7px; height: 7px; border-radius: 50%; background: #FF6B35; }

        /* Input Bar */
        .interview-input-bar { display: flex; gap: 10px; align-items: flex-end; padding: 12px 20px; border-top: 1px solid #E8D5C4; background: #FFFBF5; flex-shrink: 0; }
        .interview-textarea { flex: 1; resize: none; background: #FFFFFF; border: 2px solid #E8D5C4; border-radius: 12px; padding: 10px 14px; font-size: 13px; color: #1A1A2E; outline: none; font-family: 'Inter', sans-serif; line-height: 1.5; max-height: 80px; box-shadow: none; transition: border-color 0.2s; }
        .interview-textarea:focus { border-color: #FF6B35; }
        .interview-send-btn { width: 42px; height: 42px; min-width: 42px; border-radius: 10px; border: none; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; transition: background 0.2s; }
        .interview-done-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #E8D5C4; background: #E8F8F0; flex-shrink: 0; font-size: 13px; font-weight: 600; color: #2ECC71; }
        .interview-done-bar button { background: none; border: none; color: #FF6B35; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; }

        @media (max-width: 767px) {
          .interview-root { height: auto; min-height: calc(100vh - 140px); padding-bottom: 70px; }
          .interview-header h2 { font-size: 20px; }
          .interview-msg { max-width: 90%; }
          .interview-messages { padding: 14px; }
          .interview-input-bar { padding: 10px 14px; }
          .interview-problem { padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}
