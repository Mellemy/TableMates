const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  tableNumber: { type: String, required: true, trim: true },
  seats: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Maintenance'],
    default: 'Available'
  }
});

module.exports = mongoose.model('Table', TableSchema);
