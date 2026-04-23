require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Restaurant = require('./src/models/Restaurant');
const Table = require('./src/models/Table');
const User = require('./src/models/User');

const restaurants = [
  {
    name: 'Bella Italia',
    location: 'City Center',
    rating: 4.8,
    cuisine: 'Italian',
    openingTime: '10:00 AM - 11:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    description: 'Classic Italian dishes and a warm evening dining atmosphere.'
  },
  {
    name: 'Sushi House',
    location: 'Main Street',
    rating: 4.7,
    cuisine: 'Japanese',
    openingTime: '11:00 AM - 10:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80',
    description: 'Fresh sushi and Japanese favorites served daily.'
  },
  {
    name: 'Burger Corner',
    location: 'Downtown',
    rating: 4.5,
    cuisine: 'American',
    openingTime: '09:00 AM - 12:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80',
    description: 'Burgers, fries, and casual comfort food for every group size.'
  },
  {
    name: 'Golden Fork',
    location: 'Riverside Avenue',
    rating: 4.9,
    cuisine: 'Fine Dining',
    openingTime: '12:00 PM - 11:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    description: 'A premium dining experience with elegant plated dishes.'
  }
];

const tableTemplates = [
  [
    { tableNumber: 'T1', seats: 2, status: 'Available' },
    { tableNumber: 'T2', seats: 4, status: 'Reserved' },
    { tableNumber: 'T3', seats: 6, status: 'Available' }
  ],
  [
    { tableNumber: 'T1', seats: 2, status: 'Available' },
    { tableNumber: 'T2', seats: 4, status: 'Maintenance' },
    { tableNumber: 'T3', seats: 6, status: 'Available' }
  ],
  [
    { tableNumber: 'T1', seats: 4, status: 'Available' },
    { tableNumber: 'T2', seats: 8, status: 'Reserved' }
  ],
  [
    { tableNumber: 'T1', seats: 2, status: 'Available' },
    { tableNumber: 'T2', seats: 8, status: 'Available' }
  ]
];

const adminUsers = [
  { email: 'bellaadmin@tablemates.com', password: 'admin123', restaurantIndex: 0 },
  { email: 'sushiadmin@tablemates.com', password: 'admin123', restaurantIndex: 1 },
  { email: 'burgeradmin@tablemates.com', password: 'admin123', restaurantIndex: 2 },
  { email: 'goldenadmin@tablemates.com', password: 'admin123', restaurantIndex: 3 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Mongo for seeding...');

    await Promise.all([
      Restaurant.deleteMany({}),
      Table.deleteMany({}),
      User.deleteMany({})
    ]);

    const insertedRestaurants = await Restaurant.insertMany(restaurants);

    const tables = insertedRestaurants.flatMap((restaurant, index) =>
      tableTemplates[index].map((table) => ({
        ...table,
        restaurantId: restaurant._id
      }))
    );

    await Table.insertMany(tables);

    const users = await Promise.all(
      adminUsers.map(async (user) => ({
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        role: 'admin',
        restaurantId: insertedRestaurants[user.restaurantIndex]._id
      }))
    );

    await User.insertMany(users);

    console.log('✅ Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
