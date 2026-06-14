import api from "../lib/api";

export const progressApi = {
  trackExecution: async (code, language, status, problemTitle) => {
    const response = await api.post("/progress/track", {
      code,
      language,
      status,
      problemTitle,
    });
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get("/progress");
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/progress/history");
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get("/progress/analytics");
    return response.data;
  },
};
