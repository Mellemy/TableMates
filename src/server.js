import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let reservations = [];

const restaurants = [
  {
    id: 1,
    name: "Bella Italia",
    location: "City Center",
    rating: "4.8",
    openingTime: "10:00 AM - 11:00 PM",
  },
  {
    id: 2,
    name: "Sushi House",
    location: "Main Street",
    rating: "4.7",
    openingTime: "11:00 AM - 10:30 PM",
  },
  {
    id: 3,
    name: "Burger Corner",
    location: "Downtown",
    rating: "4.5",
    openingTime: "09:00 AM - 12:00 AM",
  },
  {
    id: 4,
    name: "Golden Fork",
    location: "Riverside Avenue",
    rating: "4.9",
    openingTime: "12:00 PM - 11:30 PM",
  },
];

let tables = [
  { id: 1, restaurantId: 1, tableNumber: "T1", seats: 2, status: "Available" },
  { id: 2, restaurantId: 1, tableNumber: "T2", seats: 4, status: "Reserved" },
  { id: 3, restaurantId: 1, tableNumber: "T3", seats: 6, status: "Available" },

  { id: 4, restaurantId: 2, tableNumber: "T1", seats: 2, status: "Available" },
  { id: 5, restaurantId: 2, tableNumber: "T2", seats: 4, status: "Maintenance" },
  { id: 6, restaurantId: 2, tableNumber: "T3", seats: 6, status: "Available" },

  { id: 7, restaurantId: 3, tableNumber: "T1", seats: 4, status: "Available" },
  { id: 8, restaurantId: 3, tableNumber: "T2", seats: 8, status: "Reserved" },

  { id: 9, restaurantId: 4, tableNumber: "T1", seats: 2, status: "Available" },
  { id: 10, restaurantId: 4, tableNumber: "T2", seats: 8, status: "Available" },
];

app.get("/", (req, res) => {
  res.send("Tablemates API is running...");
});

app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

app.get("/api/restaurants/:restaurantId/tables", (req, res) => {
  const restaurantId = Number(req.params.restaurantId);
  const restaurantTables = tables.filter(
    (table) => Number(table.restaurantId) === restaurantId
  );
  res.json(restaurantTables);
});

app.post("/api/reservations", (req, res) => {
  try {
    const {
      name,
      restaurantId,
      restaurantName,
      tableId,
      tableNumber,
      date,
      time,
      guests,
    } = req.body;

    const selectedTable = tables.find(
      (table) =>
        Number(table.id) === Number(tableId) &&
        Number(table.restaurantId) === Number(restaurantId)
    );

    if (!selectedTable) {
      return res.status(404).json({ message: "Selected table not found." });
    }

    if (selectedTable.status !== "Available") {
      return res.status(400).json({ message: "Selected table is not available." });
    }

    const newReservation = {
      id: Date.now(),
      name,
      restaurantId,
      restaurantName,
      tableId,
      tableNumber,
      date,
      time,
      guests,
    };

    reservations.push(newReservation);

    tables = tables.map((table) =>
      Number(table.id) === Number(tableId)
        ? { ...table, status: "Reserved" }
        : table
    );

    res.status(201).json({
      message: "Reservation submitted successfully",
      data: newReservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Error creating reservation" });
  }
});

app.get("/api/admin/reservations", (req, res) => {
  res.json(reservations);
});

app.put("/api/admin/reservations/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      restaurantId,
      restaurantName,
      tableId,
      tableNumber,
      date,
      time,
      guests,
    } = req.body;

    const index = reservations.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservations[index] = {
      ...reservations[index],
      name,
      restaurantId,
      restaurantName,
      tableId,
      tableNumber,
      date,
      time,
      guests,
    };

    res.json({
      message: "Reservation updated successfully",
      data: reservations[index],
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Error updating reservation" });
  }
});

app.delete("/api/admin/reservations/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingReservation = reservations.find((r) => r.id === id);

    if (!existingReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    tables = tables.map((table) =>
      Number(table.id) === Number(existingReservation.tableId)
        ? { ...table, status: "Available" }
        : table
    );

    reservations = reservations.filter((r) => r.id !== id);

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Error deleting reservation" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server spinning on http://localhost:${PORT}`);
});