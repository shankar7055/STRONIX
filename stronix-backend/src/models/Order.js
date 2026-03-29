import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem"
    }
  ],

  totalAmount: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING"
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);