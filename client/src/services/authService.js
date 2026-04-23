import { apiFetch } from "./api";

export const signupUser = (data) =>
  apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
