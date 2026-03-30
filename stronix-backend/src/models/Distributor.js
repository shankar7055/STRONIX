import mongoose from "mongoose";

const distributorSchema = new mongoose.Schema({
    name: String,
    phone: String,

    serviceArea: String,

    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    currentLoad: {
        type: Number,
        default: 0
    },
    maxCapacity: {
        type: Number,
        default: 5
    },
    totalDeliveries: {
        type: Number,
        default: 0
    },
    successfulDeliveries: {
        type: Number,
        default: 0
    },
    failedDeliveries: {
        type: Number,
        default: 0
    },
    avgDeliveryTime: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 5
    }
}, {timestamps: true});

export default mongoose.model("Distributor", distributorSchema);