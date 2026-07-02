import api from "./api";

export const getLatestMealPlan = async () => {
  const response = await api.get("/latest-meal-plan");
  return response.data;
};

export const regenerateMealPlan = async () => {
  const response = await api.post("/regenerate-meal-plan");
  return response.data;
};