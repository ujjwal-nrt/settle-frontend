import { apiRequest } from "./apiClient";

export const loginUser = (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = (data) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = () => {
  return apiRequest("/auth/me");
};


export const getMe = () => {
  return apiRequest("/auth/me", {
    method: "GET",
  });
};