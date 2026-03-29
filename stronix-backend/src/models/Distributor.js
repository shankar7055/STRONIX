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
    }

}, {timestamps: true});

export default mongoose.model("Distributor", distributorSchema);