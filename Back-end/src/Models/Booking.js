import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookingSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  packID: {
    type: Schema.Types.ObjectId,
    ref: 'Pack',
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

export default mongoose.model('Booking', bookingSchema);
