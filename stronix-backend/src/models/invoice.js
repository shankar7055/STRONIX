import mongoose from "mongoose";
import PurchaseOrder from "./PurchaseOrder.js";

const invoiceSchema = new mongoose.Schema({
    PurchaseOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "purchaseOrder",
        required: true
    },

    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    fileUrl: {
        type: String
    },

    status: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING"
    }
}, { timestamps: true});

export default mongoose.model("Invoice", invoiceSchema);