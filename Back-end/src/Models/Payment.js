// models/payment.model.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,ref:"bookings",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  stripeSessionId: {
    type: String,
    required: true
  }
});

export default mongoose.model("Payment", paymentSchema);
