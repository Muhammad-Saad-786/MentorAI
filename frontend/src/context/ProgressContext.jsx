import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { progressApi } from "../services/progressApi";
import api from "../lib/api";
import { AuthContext } from "./AuthContext";

export const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);

  // Load progress from backend
  const loadProgress = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await progressApi.getProgress();
      setProgress(data);
    } catch (error) {
      console.error("Failed to load progress:", error.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load chat sessions from backend
  const loadChatSessions = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await api.get("/mentor/sessions");
      setChatSessions(response.data || []);
    } catch (error) {
      console.error("Failed to load chats:", error.message);
    }
  }, [user]);

  // Track code execution
  const trackExecution = useCallback(
    async (code, language, status, problemTitle) => {
      try {
        await progressApi.trackExecution(code, language, status, problemTitle);
        // Reload progress after tracking
        await loadProgress();
      } catch (error) {
        console.error("Failed to track execution:", error.message);
      }
    },
    [loadProgress],
  );

  // Weak topics
  const getWeakTopics = useCallback(() => {
    if (!progress?.topics) return [];
    return progress.topics
      .filter((t) => t.score < 50)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [progress]);

  // Recommendations
  const getRecommendations = useCallback(() => {
    if (!progress?.topics) return [];
    const strong = progress.topics
      .filter((t) => t.score >= 50)
      .map((t) => t.name);
    const skillTree = {
      Variables: ["Conditionals", "Loops"],
      Loops: ["Functions", "Arrays"],
      Functions: ["Recursion"],
      Arrays: ["Sorting"],
      Recursion: ["Dynamic Programming"],
    };
    const recs = [];
    for (const topic of strong) {
      const children = skillTree[topic] || [];
      for (const child of children) {
        if (!strong.includes(child) && !recs.find((r) => r.topic === child)) {
          recs.push({ topic: child, reason: "Prerequisites met" });
        }
      }
    }
    const weak = progress.topics.filter((t) => t.score < 50).map((t) => t.name);
    return [
      ...recs.filter((r) => weak.includes(r.topic)),
      ...recs.filter((r) => !weak.includes(r.topic)),
    ].slice(0, 5);
  }, [progress]);

  // Load on mount
  useEffect(() => {
    loadProgress();
    loadChatSessions();
  }, [loadProgress, loadChatSessions]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        chatSessions,
        trackExecution,
        getWeakTopics,
        getRecommendations,
        loadProgress,
        loadChatSessions,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
