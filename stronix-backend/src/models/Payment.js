import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["INITIATED", "SUCCESS", "FAILED"],
        default: "INITIATED"
    }
}, { timestamps: true});

export default mongoose.model("Payment", paymentSchema);