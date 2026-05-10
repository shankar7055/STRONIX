import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

warehouseSchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Warehouse", warehouseSchema);
