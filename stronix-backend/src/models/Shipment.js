import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  address: {
    type: String,
    required: true
  },

  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Distributor"
  },

  status: {
    type: String,
    enum: ["CREATED", "ASSIGNED", "IN_TRANSIT", "DELIVERED", "FAILED"],
    default: "CREATED"
  },
  
  assignedAt: {
    type: Date
  },

  deliveredAt: {
    type: Date
  },

  tracking: [
    {
      status: String,
      timestamp: Date
    }
  ]

}, { timestamps: true });

export default mongoose.model("Shipment", shipmentSchema);