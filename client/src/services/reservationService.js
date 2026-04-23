import { apiFetch } from "./api";

export const createReservation = (data) =>
  apiFetch("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
