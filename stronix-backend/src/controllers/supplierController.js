import Supplier from "../models/Supplier.js";
import AuditLog from "../models/AuditLog.js";

export const createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.json(supplier);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};
