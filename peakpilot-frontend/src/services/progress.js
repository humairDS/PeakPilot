import api from "./api";

export const getProgress = async () => {
  const response = await api.get("/progress");
  return response.data;
};

export const addProgress = async (progressData) => {
  const response = await api.post("/progress", progressData);
  return response.data;
};