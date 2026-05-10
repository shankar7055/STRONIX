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
        enum: ["ACTIVATE", "INACTIVE"],
        default: "ACTIVATE"
    }
}, {timestamps: true});

export default mongoose.model("Product", productSchema);