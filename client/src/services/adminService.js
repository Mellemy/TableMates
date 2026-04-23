import { apiFetch } from "./api";

export const getReservations = () => apiFetch("/api/admin/reservations");

export const updateReservation = (id, data) =>
  apiFetch(`/api/admin/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteReservation = (id) =>
  apiFetch(`/api/admin/reservations/${id}`, {
    method: "DELETE",
  });
