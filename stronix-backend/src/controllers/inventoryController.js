import Inventory from "../models/Inventory.js";
import AuditLog from "../models/AuditLog.js";



export const addStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      inventory = await Inventory.create({
        product: productId,
        availableQuantity: quantity
      });
    } else {
      inventory.availableQuantity += quantity;
      await inventory.save();
    }

    res.json(inventory);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getStock = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await Inventory.findOne({ product: productId });

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
