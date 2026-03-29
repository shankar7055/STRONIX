import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: false
    },

    availableQuantity: {
        type: Number,
        default: 0,
        min: 0
    },

    reservedQuantity: {
        type: Number,
        default: 0,
        min: 0
    }
}, {timestamps: true});

export default mongoose.model("Inventory", inventorySchema);
