import { apiRequest } from "./apiClient";

export const updateProfile = (data) => {
  return apiRequest("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
