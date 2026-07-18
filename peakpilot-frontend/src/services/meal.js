import api from "./api";

export const getLatestMealPlan = async () => {
  const response = await api.get("/api/latest-meal-plan");
  return response.data;
};

export const regenerateMealPlan = async () => {
  const response = await api.post("/api/regenerate-meal-plan");
  return response.data;
};