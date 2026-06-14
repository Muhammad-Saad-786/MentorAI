import api from "../lib/api";

export const interviewApi = {
  start: async (message) => {
    const response = await api.post("/interview/start", { message });
    return response.data;
  },
  continue: async (history, message) => {
    const response = await api.post("/interview/continue", {
      history,
      message,
    });
    return response.data;
  },
  getFeedback: async (history, solution) => {
    const response = await api.post("/interview/feedback", {
      history,
      solution,
    });
    return response.data;
  },
};
