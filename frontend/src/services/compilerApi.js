import api from "../lib/api";

export const compilerApi = {
  runCode: async (code, language, stdin = "") => {
    const response = await api.post("/compiler/run", { code, language, stdin });
    return response.data;
  },
  reviewCode: async (code, language) => {
    const response = await api.post("/compiler/review", { code, language });
    return response.data;
  },

  getLanguages: async () => {
    const response = await api.get("/compiler/languages");
    return response.data;
  },
};
