import Warehouse from "../models/Warehouse.js";

export const createWarehouse = async (req, res) => {
  try {
    const { code, name, address, status } = req.body;
    const warehouse = await Warehouse.create({ code, name, address, status });
    res.status(201).json(warehouse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { code, name, address, status } = req.body;
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.warehouseId,
      { code, name, address, status },
      { new: true }
    );
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
