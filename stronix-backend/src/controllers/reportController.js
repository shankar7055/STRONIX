import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import AuditLog from "../models/AuditLog.js";

export const getSalesReport = async (req , res) => {
    try{
        const orders = await Order.find({ status: "CONFIRMED"});

        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        res.json({ 
            totalOrders: orders.length,
            totalSales
        });
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const getInventoryReport = async (req, res) => {
    try {
        const inventory = await Inventory.find().populate("product");

        res.json(inventory);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const getSupplierReport = async(req , res)=> {
    try {
        const data = await PurchaseOrder.aggregate([
            {
                $group: {
                    _id: "$supplier",
                    totalOrders: { $sum: 1},
                    totalAmount: { $sum: "$totalAmount"}
                }
            }
        ]);
        res.json(data);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

