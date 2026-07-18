import api from "./api";

export const getMlRecommendation = async () => {
  const response = await api.get("/ml/recommendation");
  return response.data;
};

export const getMlAccuracy = async () => {
  const response = await api.get("/ml/accuracy");
  return response.data;
};