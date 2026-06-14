import api from "../lib/api";

export const achievementApi = {
  getAll: async () => {
    const response = await api.get("/achievements");
    return response.data;
  },
  check: async () => {
    const response = await api.post("/achievements/check");
    return response.data;
  },
};
