export const getRestaurantTables = async (restaurantId) => {
  const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/tables`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }

  return result;
};