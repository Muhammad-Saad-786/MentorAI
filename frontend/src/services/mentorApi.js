import api from "../lib/api";

export const mentorApi = {
  // General chat
  sendMessage: async (message, sessionId, mode = "default") => {
    const response = await api.post("/mentor/chat", {
      message,
      sessionId,
      mode,
    });
    return response.data;
  },

  // Debug mode
  debugCode: async (code, error, language, sessionId) => {
    const response = await api.post("/mentor/debug", {
      code,
      error,
      language,
      sessionId,
    });
    return response.data;
  },

  // Code review
  reviewCode: async (code, language, sessionId) => {
    const response = await api.post("/mentor/review", {
      code,
      language,
      sessionId,
    });
    return response.data;
  },

  // Get hint for a problem
  getHint: async (problem, currentCode, language, sessionId) => {
    const response = await api.post("/mentor/hint", {
      problem,
      currentCode,
      language,
      sessionId,
    });
    return response.data;
  },
};
