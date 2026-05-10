import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse"
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



orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });


export default mongoose.model("Order", orderSchema);
