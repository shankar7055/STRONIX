import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["CREATED", "RECEIVED", "CANCELLED"],
        default: "CREATED"
    }
}, {timestamps: true});

purchaseOrderSchema.index({ supplier: 1 });


export default mongoose.model("PurchaseOrder", purchaseOrderSchema);