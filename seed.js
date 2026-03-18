require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');

const restaurants = [
  {
    name: "Pedrinas",
    location: "Kokkola",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500",
    description: "Authentic Tex-Mex in the heart of Kokkola."
  },
  {
    name: "Nera Scandinavian Steakhouse",
    location: "Kokkola",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500",
    description: "Quality meats and Scandinavian flavors."
  },
  {
    name: "Bank Food & Wine",
    location: "Vaasa",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1550966841-3ee322625292?w=500",
    description: "Modern dining in a historic Vaasa setting."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo for seeding...");
    
    // Clear out existing restaurants to avoid duplicates
    await Restaurant.deleteMany({});
    
    // Insert our new list
    await Restaurant.insertMany(restaurants);
    
    console.log("✅ Database Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDB();