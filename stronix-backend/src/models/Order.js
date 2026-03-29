import mongoose from "mongoose";
import Product from "../models/Product.js";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING"
    }
}, { timestamps: true});

export default mongoose.model("Order", orderSchema);