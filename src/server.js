const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the models we just created
const Restaurant = require('./models/Restaurant');
const Reservation = require('./models/Reservation');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (We will put the link in the .env file next)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Tablemates Database Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Simple "Health Check" Route
app.get('/', (req, res) => {
  res.send("Tablemates API is running...");
});

// 3. GET all restaurants (For your Homepage)
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. POST a new reservation (For your Booking Page)
app.post('/api/reservations', async (req, res) => {
  try {
    const newBooking = new Reservation(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/admin/reservations', async (req, res) => {
  try {
    // .populate('restaurantId') is a Mongoose "magic" trick.
    // Instead of just seeing an ID number, it replaces it with the full Restaurant object.
    const bookings = await Reservation.find().populate('restaurantId');
    
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard data", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server spinning on http://localhost:${PORT}`));