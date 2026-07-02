import api from "./api";

export const regenerateWorkoutPlan = async () => {
  const response = await api.post("/ai/regenerate-plan");
  return response.data;
};