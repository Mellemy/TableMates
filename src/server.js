const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = require('./middleware/auth');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Reservation = require('./models/Reservation');
const Table = require('./models/Table');

const app = express();
const isDemoMode = process.env.DEMO_MODE === 'true';

app.use(cors());
app.use(express.json());

const demoRestaurants = [
  {
    _id: 'rest-1',
    name: 'Bella Italia',
    location: 'City Center',
    rating: 4.8,
    cuisine: 'Italian',
    openingTime: '10:00 AM - 11:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    description: 'Classic Italian dishes and a warm evening dining atmosphere.'
  },
  {
    _id: 'rest-2',
    name: 'Sushi House',
    location: 'Main Street',
    rating: 4.7,
    cuisine: 'Japanese',
    openingTime: '11:00 AM - 10:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80',
    description: 'Fresh sushi and Japanese favorites served daily.'
  },
  {
    _id: 'rest-3',
    name: 'Burger Corner',
    location: 'Downtown',
    rating: 4.5,
    cuisine: 'American',
    openingTime: '09:00 AM - 12:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80',
    description: 'Burgers, fries, and casual comfort food for every group size.'
  },
  {
    _id: 'rest-4',
    name: 'Golden Fork',
    location: 'Riverside Avenue',
    rating: 4.9,
    cuisine: 'Fine Dining',
    openingTime: '12:00 PM - 11:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    description: 'A premium dining experience with elegant plated dishes.'
  }
];

let demoTables = [
  { _id: 'table-1', restaurantId: 'rest-1', tableNumber: 'T1', seats: 2, status: 'Available' },
  { _id: 'table-2', restaurantId: 'rest-1', tableNumber: 'T2', seats: 4, status: 'Reserved' },
  { _id: 'table-3', restaurantId: 'rest-1', tableNumber: 'T3', seats: 6, status: 'Available' },
  { _id: 'table-4', restaurantId: 'rest-2', tableNumber: 'T1', seats: 2, status: 'Available' },
  { _id: 'table-5', restaurantId: 'rest-2', tableNumber: 'T2', seats: 4, status: 'Maintenance' },
  { _id: 'table-6', restaurantId: 'rest-2', tableNumber: 'T3', seats: 6, status: 'Available' },
  { _id: 'table-7', restaurantId: 'rest-3', tableNumber: 'T1', seats: 4, status: 'Available' },
  { _id: 'table-8', restaurantId: 'rest-3', tableNumber: 'T2', seats: 8, status: 'Reserved' },
  { _id: 'table-9', restaurantId: 'rest-4', tableNumber: 'T1', seats: 2, status: 'Available' },
  { _id: 'table-10', restaurantId: 'rest-4', tableNumber: 'T2', seats: 8, status: 'Available' }
];

let demoReservations = [];
let demoUsers = [];

const mapTable = (table) => ({
  id: table._id,
  restaurantId: table.restaurantId,
  tableNumber: table.tableNumber,
  seats: table.seats,
  status: table.status
});

const mapRestaurant = (restaurant) => ({
  id: restaurant._id,
  name: restaurant.name,
  location: restaurant.location,
  rating: restaurant.rating,
  cuisine: restaurant.cuisine,
  openingTime: restaurant.openingTime,
  imageUrl: restaurant.imageUrl,
  description: restaurant.description
});

const mapReservation = (reservation) => ({
  id: reservation._id,
  restaurantId: reservation.restaurantId?._id || reservation.restaurantId,
  restaurantName: reservation.restaurantName || reservation.restaurantId?.name || '',
  tableId: reservation.tableId?._id || reservation.tableId,
  tableNumber: reservation.tableNumber || reservation.tableId?.tableNumber || '',
  name: reservation.customerName,
  email: reservation.email,
  date: reservation.date,
  time: reservation.time,
  guests: reservation.partySize,
  status: reservation.status,
  createdAt: reservation.createdAt
});

const ensureAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

const createDemoToken = (user) => jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId || null
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const bootDemoData = async () => {
  if (!isDemoMode) {
    return;
  }

  demoUsers = [
    {
      _id: 'user-admin-1',
      email: 'bellaadmin@tablemates.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      restaurantId: 'rest-1',
      restaurantName: 'Bella Italia'
    },
    {
      _id: 'user-admin-2',
      email: 'sushiadmin@tablemates.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      restaurantId: 'rest-2',
      restaurantName: 'Sushi House'
    },
    {
      _id: 'user-admin-3',
      email: 'burgeradmin@tablemates.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      restaurantId: 'rest-3',
      restaurantName: 'Burger Corner'
    },
    {
      _id: 'user-admin-4',
      email: 'goldenadmin@tablemates.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      restaurantId: 'rest-4',
      restaurantName: 'Golden Fork'
    }
  ];

  console.log('ℹ️ Running in demo mode without MongoDB');
};

const connectDatabase = async () => {
  if (isDemoMode) {
    await bootDemoData();
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ TableMates database connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

app.get('/', (req, res) => {
  res.send('TableMates API is running...');
});

app.get('/api/restaurants', async (req, res) => {
  try {
    if (isDemoMode) {
      return res.json(demoRestaurants.map(mapRestaurant));
    }

    const restaurants = await Restaurant.find().sort({ name: 1 });
    return res.json(restaurants.map(mapRestaurant));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
});

app.get('/api/restaurants/:restaurantId/tables', async (req, res) => {
  try {
    if (isDemoMode) {
      const tables = demoTables
        .filter((table) => table.restaurantId === req.params.restaurantId)
        .sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));
      return res.json(tables.map(mapTable));
    }

    const tables = await Table.find({ restaurantId: req.params.restaurantId }).sort({ tableNumber: 1 });
    return res.json(tables.map(mapTable));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch tables' });
  }
});

app.post('/api/reservations', auth, async (req, res) => {
  try {
    const { restaurantId, tableId, date, time, guests, partySize, name, customerName } = req.body;

    if (isDemoMode) {
      const selectedTable = demoTables.find(
        (table) => table._id === tableId && table.restaurantId === restaurantId
      );

      if (!selectedTable) {
        return res.status(404).json({ message: 'Selected table not found.' });
      }

      if (selectedTable.status !== 'Available') {
        return res.status(400).json({ message: 'Selected table is not available.' });
      }

      selectedTable.status = 'Reserved';

      const restaurant = demoRestaurants.find((item) => item._id === restaurantId);
      const reservation = {
        _id: `res-${Date.now()}`,
        restaurantId,
        restaurantName: restaurant?.name || '',
        tableId,
        tableNumber: selectedTable.tableNumber,
        customerName: customerName || name,
        email: req.user.email,
        date,
        time,
        partySize: Number(partySize || guests),
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      demoReservations.unshift(reservation);
      return res.status(201).json(mapReservation(reservation));
    }

    const selectedTable = await Table.findOne({ _id: tableId, restaurantId });

    if (!selectedTable) {
      return res.status(404).json({ message: 'Selected table not found.' });
    }

    if (selectedTable.status !== 'Available') {
      return res.status(400).json({ message: 'Selected table is not available.' });
    }

    const reservation = await Reservation.create({
      restaurantId,
      tableId,
      customerName: customerName || name,
      email: req.user.email,
      date,
      time,
      partySize: Number(partySize || guests)
    });

    selectedTable.status = 'Reserved';
    await selectedTable.save();

    const populated = await Reservation.findById(reservation._id)
      .populate('restaurantId')
      .populate('tableId');

    return res.status(201).json(mapReservation(populated));
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to create reservation' });
  }
});

app.get('/api/admin/reservations', auth, ensureAdmin, async (req, res) => {
  try {
    if (isDemoMode) {
      const reservations = demoReservations.filter(
        (reservation) => reservation.restaurantId === req.user.restaurantId
      );
      return res.json(reservations.map(mapReservation));
    }

    const query = req.user.restaurantId ? { restaurantId: req.user.restaurantId } : {};
    const reservations = await Reservation.find(query)
      .populate('restaurantId')
      .populate('tableId')
      .sort({ createdAt: -1 });

    return res.json(reservations.map(mapReservation));
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching reservations' });
  }
});

app.put('/api/admin/reservations/:id', auth, ensureAdmin, async (req, res) => {
  try {
    if (isDemoMode) {
      const reservation = demoReservations.find((item) => item._id === req.params.id);

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      if (reservation.restaurantId !== req.user.restaurantId) {
        return res.status(403).json({ message: 'You can only manage your own restaurant reservations' });
      }

      reservation.customerName = req.body.name || req.body.customerName || reservation.customerName;
      reservation.date = req.body.date || reservation.date;
      reservation.time = req.body.time || reservation.time;
      reservation.partySize = Number(req.body.guests || req.body.partySize || reservation.partySize);

      return res.json({ message: 'Reservation updated successfully', data: mapReservation(reservation) });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (String(reservation.restaurantId) !== String(req.user.restaurantId)) {
      return res.status(403).json({ message: 'You can only manage your own restaurant reservations' });
    }

    reservation.customerName = req.body.name || req.body.customerName || reservation.customerName;
    reservation.date = req.body.date || reservation.date;
    reservation.time = req.body.time || reservation.time;
    reservation.partySize = Number(req.body.guests || req.body.partySize || reservation.partySize);

    await reservation.save();

    const populated = await Reservation.findById(reservation._id)
      .populate('restaurantId')
      .populate('tableId');

    return res.json({ message: 'Reservation updated successfully', data: mapReservation(populated) });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating reservation' });
  }
});

app.delete('/api/admin/reservations/:id', auth, ensureAdmin, async (req, res) => {
  try {
    if (isDemoMode) {
      const reservationIndex = demoReservations.findIndex((item) => item._id === req.params.id);

      if (reservationIndex === -1) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      const reservation = demoReservations[reservationIndex];
      if (reservation.restaurantId !== req.user.restaurantId) {
        return res.status(403).json({ message: 'You can only manage your own restaurant reservations' });
      }

      demoTables = demoTables.map((table) =>
        table._id === reservation.tableId ? { ...table, status: 'Available' } : table
      );
      demoReservations.splice(reservationIndex, 1);

      return res.json({ message: 'Reservation deleted successfully' });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (String(reservation.restaurantId) !== String(req.user.restaurantId)) {
      return res.status(403).json({ message: 'You can only manage your own restaurant reservations' });
    }

    await Table.findByIdAndUpdate(reservation.tableId, { status: 'Available' });
    await reservation.deleteOne();

    return res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting reservation' });
  }
});

app.post('/api/admin/tables', auth, ensureAdmin, async (req, res) => {
  try {
    if (isDemoMode) {
      const normalizedTableNumber = req.body.tableNumber?.trim().toUpperCase();
      const duplicateTable = demoTables.find(
        (table) =>
          table.restaurantId === req.user.restaurantId &&
          table.tableNumber.trim().toUpperCase() === normalizedTableNumber
      );

      if (duplicateTable) {
        return res.status(400).json({ message: 'This table number already exists for your restaurant.' });
      }

      const table = {
        _id: `table-${Date.now()}`,
        restaurantId: req.user.restaurantId,
        tableNumber: normalizedTableNumber,
        seats: Number(req.body.seats),
        status: req.body.status || 'Available'
      };

      demoTables.push(table);
      return res.status(201).json(mapTable(table));
    }

    const normalizedTableNumber = req.body.tableNumber?.trim().toUpperCase();
    const duplicateTable = await Table.findOne({
      restaurantId: req.user.restaurantId,
      tableNumber: normalizedTableNumber
    });

    if (duplicateTable) {
      return res.status(400).json({ message: 'This table number already exists for your restaurant.' });
    }

    const table = await Table.create({
      restaurantId: req.user.restaurantId,
      tableNumber: normalizedTableNumber,
      seats: Number(req.body.seats),
      status: req.body.status || 'Available'
    });

    return res.status(201).json(mapTable(table));
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to add table' });
  }
});

app.put('/api/admin/tables/:id', auth, ensureAdmin, async (req, res) => {
  try {
    if (isDemoMode) {
      const table = demoTables.find((item) => item._id === req.params.id);

      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }

      if (table.restaurantId !== req.user.restaurantId) {
        return res.status(403).json({ message: 'You can only manage tables for your own restaurant' });
      }

      const normalizedTableNumber = req.body.tableNumber?.trim().toUpperCase() || table.tableNumber;
      const duplicateTable = demoTables.find(
        (item) =>
          item._id !== req.params.id &&
          item.restaurantId === req.user.restaurantId &&
          item.tableNumber.trim().toUpperCase() === normalizedTableNumber
      );

      if (duplicateTable) {
        return res.status(400).json({ message: 'This table number already exists for your restaurant.' });
      }

      table.tableNumber = normalizedTableNumber;
      table.seats = Number(req.body.seats || table.seats);
      table.status = req.body.status || table.status;

      return res.json(mapTable(table));
    }

    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (String(table.restaurantId) !== String(req.user.restaurantId)) {
      return res.status(403).json({ message: 'You can only manage tables for your own restaurant' });
    }

    const normalizedTableNumber = req.body.tableNumber?.trim().toUpperCase() || table.tableNumber;
    const duplicateTable = await Table.findOne({
      _id: { $ne: req.params.id },
      restaurantId: req.user.restaurantId,
      tableNumber: normalizedTableNumber
    });

    if (duplicateTable) {
      return res.status(400).json({ message: 'This table number already exists for your restaurant.' });
    }

    table.tableNumber = normalizedTableNumber;
    table.seats = Number(req.body.seats || table.seats);
    table.status = req.body.status || table.status;
    await table.save();

    return res.json(mapTable(table));
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to update table' });
  }
});

app.delete('/api/admin/tables/:id', auth, ensureAdmin, async (req, res) => {
  try {
    if (isDemoMode) {
      const tableIndex = demoTables.findIndex((item) => item._id === req.params.id);

      if (tableIndex === -1) {
        return res.status(404).json({ message: 'Table not found' });
      }

      if (demoTables[tableIndex].restaurantId !== req.user.restaurantId) {
        return res.status(403).json({ message: 'You can only manage tables for your own restaurant' });
      }

      demoTables.splice(tableIndex, 1);
      return res.json({ message: 'Table deleted successfully' });
    }

    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (String(table.restaurantId) !== String(req.user.restaurantId)) {
      return res.status(403).json({ message: 'You can only manage tables for your own restaurant' });
    }

    await table.deleteOne();
    return res.json({ message: 'Table deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting table' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isDemoMode) {
      const existingUser = demoUsers.find((user) => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      demoUsers.push({
        _id: `user-${Date.now()}`,
        email,
        password: hashedPassword,
        role: 'customer',
        restaurantId: null,
        restaurantName: null
      });

      return res.status(201).json({ message: 'User created successfully!' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    return res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isDemoMode) {
      const user = demoUsers.find((item) => item.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = createDemoToken(user);
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId,
          restaurantName: user.restaurantName
        }
      });
    }

    const user = await User.findOne({ email }).populate('restaurantId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId?._id || null
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId?._id || null,
        restaurantName: user.restaurantId?.name || null
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
});

const PORT = process.env.PORT || 5000;

connectDatabase().finally(() => {
  app.listen(PORT, () => console.log(`🚀 Server spinning on http://localhost:${PORT}`));
});
