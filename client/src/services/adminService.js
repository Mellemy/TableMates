export const getReservations = async () => {
  const response = await fetch("http://localhost:5000/api/admin/reservations");
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return result;
};

export const updateReservation = async (id, data) => {
  const response = await fetch(`http://localhost:5000/api/admin/reservations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update reservation");
  }

  return result;
};

export const deleteReservation = async (id) => {
  const response = await fetch(`http://localhost:5000/api/admin/reservations/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete reservation");
  }

  return result;
};