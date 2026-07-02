import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/get_profile");
  return response.data;
};

export const saveProfile = async (profileData) => {
  const response = await api.post("/save_profile", {
    profile: profileData
  });
  return response.data;
};