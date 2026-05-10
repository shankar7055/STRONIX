import Inventory from "../models/Inventory.js";
import AuditLog from "../models/AuditLog.js";
import Warehouse from "../models/Warehouse.js";
import StockMovement from "../models/StockMovement.js";

const getOrCreateDefaultWarehouseId = async () => {
  const existing = await Warehouse.findOne({ code: "DEFAULT" });
  if (existing) return existing._id;
  const created = await Warehouse.create({ code: "DEFAULT", name: "Default Warehouse" });
  return created._id;
};



export const addStock = async (req, res) => {
  try {
    const { productId, quantity, warehouseId } = req.body;
    const delta = Number(quantity);
    if (!productId || !Number.isFinite(delta)) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const targetWarehouseId = warehouseId || (await getOrCreateDefaultWarehouseId());

    const inventory = await Inventory.findOneAndUpdate(
      { product: productId, warehouse: targetWarehouseId },
      {
        $inc: { availableQuantity: delta },
        $setOnInsert: { product: productId, warehouse: targetWarehouseId, reservedQuantity: 0 }
      },
      { upsert: true, new: true }
    );

    await StockMovement.create({
      type: "ADJUSTMENT",
      product: productId,
      warehouse: targetWarehouseId,
      quantity: Math.abs(delta),
      availableDelta: delta,
      reservedDelta: 0,
      reference: { entityType: "Inventory", entityId: String(inventory._id), reason: "MANUAL_ADD_STOCK" },
      createdBy: req.user?._id
    });

    await AuditLog.create({
      user: req.user?._id,
      action: "INVENTORY_ADJUSTMENT",
      entity: "Inventory",
      entityId: inventory._id
    });

    res.json(inventory);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { warehouseId } = req.query;
    const targetWarehouseId = warehouseId || (await getOrCreateDefaultWarehouseId());

    const inventory = await Inventory.findOne({ product: productId, warehouse: targetWarehouseId });

    if (!inventory) {
      return res.status(404).json({ message: "No inventory found" });
    }

    res.json({
      product: inventory.product,
      availableQuantity: inventory.availableQuantity,
      reservedQuantity: inventory.reservedQuantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStock = async( req, res) => {
    try {
        const { inventoryId, quantity, reason } = req.body;
        const delta = Number(quantity);
        if (!inventoryId || !Number.isFinite(delta)) {
          return res.status(400).json({ message: "inventoryId and quantity are required" });
        }

        const inventory = await Inventory.findById(inventoryId);

        if(!inventory){
            return res.status(404).json({ message: "Inventory not found"});
        }
        if (!inventory.warehouse) {
          inventory.warehouse = await getOrCreateDefaultWarehouseId();
        }
        if (delta < 0 && inventory.availableQuantity + delta < 0) {
          return res.status(400).json({ message: "Insufficient available stock for adjustment" });
        }

        inventory.availableQuantity += delta;

        await inventory.save();

        await StockMovement.create({
          type: "ADJUSTMENT",
          product: inventory.product,
          warehouse: inventory.warehouse,
          quantity: Math.abs(delta),
          availableDelta: delta,
          reservedDelta: 0,
          reference: { entityType: "Inventory", entityId: String(inventory._id), reason: reason || "MANUAL_UPDATE_STOCK" },
          createdBy: req.user?._id
        });

        await AuditLog.create({
          user: req.user?._id,
          action: "INVENTORY_ADJUSTMENT",
          entity: "Inventory",
          entityId: inventory._id
        });

        res.json({ message: "Stock updated", inventory});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};
