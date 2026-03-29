import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "SHIPPED", "DELIVERED"],
        default: "PROCESSING"
    },
    address: {
        type: String,
        required: true
    }
}, {timestamps: true});

export default mongoose.model("Shipment", shipmentSchema);