const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getAuthToken = () => localStorage.getItem("token");

export const apiFetch = async (path, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers["x-auth-token"] = token;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(result?.message || "Request failed");
  }

  return result;
};
