export const createReservation = async (data) => {
  const response = await fetch("http://localhost:5000/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create reservation");
  }

  return result;
};