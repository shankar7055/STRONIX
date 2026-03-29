import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "CUSTOMER", "SUPPLIER", "WAREHOUSE_MANAGER", "DISTRIBUTOR"],
    default: "CUSTOMER"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);