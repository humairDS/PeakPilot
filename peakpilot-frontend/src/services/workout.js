import api from "./api";

export const regenerateWorkoutPlan = async () => {
  const response = await api.post("/api/regenerate-plan");
  return response.data;
};