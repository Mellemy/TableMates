const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }, 
  rating: { type: Number, default: 0 },
  imageUrl: { type: String }, 
  description: { type: String }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);