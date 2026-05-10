import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["RECEIPT", "RESERVE", "UNRESERVE", "ISSUE", "ADJUSTMENT"],
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },
    quantity: { type: Number, required: true, min: 0 },
    availableDelta: { type: Number, required: true },
    reservedDelta: { type: Number, required: true },
    reference: {
      entityType: {
        type: String,
        enum: [
          "PurchaseOrder",
          "Order",
          "Shipment",
          "Inventory",
          "Invoice",
          "Payment",
          "Manual"
        ],
        default: "Manual"
      },
      entityId: { type: String },
      reason: { type: String }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

stockMovementSchema.index({ warehouse: 1, product: 1, createdAt: -1 });
stockMovementSchema.index({ "reference.entityType": 1, "reference.entityId": 1 });

export default mongoose.model("StockMovement", stockMovementSchema);
