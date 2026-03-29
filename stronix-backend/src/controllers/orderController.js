import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";

export const createOrder = async (req, res) => {
    try {
        const { productId, quantity} = req.body;

        const inventory = await Inventory.findOne({ product: productId});

        if(!inventory){
            return res.status(404).json({ message: "Product not found in inventory"});
        }

        if(inventory.availableQuantity < quantity) {
            return res.status(400).json ({ message: "Not enough stock"});
        }

        inventory.availableQuantity -= quantity;
        inventory.reservedQuantity += quantity;
        await inventory.save();


        const order = await Order.create({
            user: req.user._id,
            product: productId,
            quantity
        });
        res.json(order);
    }catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const confirmOrder = async ( req, res)=> {
    try {
        const { orderId} = req.params;

        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found"});

        const inventory = await Inventory.findOne({ product: order.product});

        inventory.reservedQuantity -= order.quantity;
        await inventory.save();

        order.status = "CONFIRMED";
        await order.save();

        res.json(order);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId} = req.params;

        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found"});

        const inventory = await Inventory.findOne({ product: order.product});

        inventory.availableQuantity += order.quantity;
        inventory.reservedQuantity -= order.quantity;
        await inventory.save();

        order.status = "CANCELLED";
        await order.save();

        res.json(order);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};