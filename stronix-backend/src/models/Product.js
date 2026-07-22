import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, {timestamps: true});

export default mongoose.model("Product", productSchema);