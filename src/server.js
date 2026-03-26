const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication Middleware (The Bouncer)
const auth = require('./middleware/auth');

// Import the models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Reservation = require('./models/Reservation');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
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

// 5. GET all reservations (ADMIN ONLY - Protected by 'auth')
// Note the 'auth' added after the URL string
app.get('/api/admin/reservations', auth, async (req, res) => {
  try {
    // .populate('restaurantId') replaces the ID with the full Restaurant object
    const bookings = await Reservation.find().populate('restaurantId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// --- AUTHENTICATION ROUTES ---

// SIGNUP ROUTE
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server spinning on http://localhost:${PORT}`));