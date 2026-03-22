import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String },
  location: { type: String },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;