const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  rating: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  cuisine: { type: String, default: '' },
  openingTime: { type: String, default: '' }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
