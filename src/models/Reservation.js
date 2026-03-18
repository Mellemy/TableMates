const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  partySize: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);