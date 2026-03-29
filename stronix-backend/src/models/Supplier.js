import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },

    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE", ],
        default: "ACTIVE"
    }
}, { timestamps: true});

export default mongoose.model("Supplier", supplierSchema);