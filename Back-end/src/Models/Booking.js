const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packID: {
    type: Schema.Types.ObjectId,
    ref: 'TripPack',
    required: true
  },
  confirmation_number: {
    type: String,
    unique: true,
    required: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
