import { apiFetch } from "./api";

export const getRestaurantTables = (restaurantId) =>
  apiFetch(`/api/restaurants/${restaurantId}/tables`);

export const createTable = (data) =>
  apiFetch("/api/admin/tables", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTable = (id, data) =>
  apiFetch(`/api/admin/tables/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteTable = (id) =>
  apiFetch(`/api/admin/tables/${id}`, {
    method: "DELETE",
  });
