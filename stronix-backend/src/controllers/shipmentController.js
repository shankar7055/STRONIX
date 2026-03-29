import Shipment from "../models/Shipment.js";
import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js";

export const createShipment = async (req, res) => {
    try {
        const { orderId, address } = req.body;

        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not Found"});

        if(order.status !== "CONFIRMED") {
            return res.status(400).json({ message: "Order not paid yet"});
        }

        const shipment = await Shipment.create({
            order: orderId,
            address
        });
        res.json(shipment);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};

export const updateShipmentStatus = async(req, res)=> {
    try {
        const { shipmentId } = req.params;
        const { status } = req.body;

        const shipment = await Shipment.findById(shipmentId);
        if(!shipment) return res.status(404).json({ message: "Shipment not found"});

        shipment.status = status;
        await shipment.save();

        res.json(shipment);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};
