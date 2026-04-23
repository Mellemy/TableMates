import { apiFetch } from "./api";

export const getRestaurants = () => apiFetch("/api/restaurants");
