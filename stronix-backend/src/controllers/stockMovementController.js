import StockMovement from "../models/StockMovement.js";

export const listStockMovements = async (req, res) => {
  try {
    const {
      warehouseId,
      productId,
      type,
      from,
      to,
      entityType,
      entityId,
      limit = "100",
      skip = "0"
    } = req.query;

    const query = {};

    if (warehouseId) query.warehouse = warehouseId;
    if (productId) query.product = productId;
    if (type) query.type = type;

    if (entityType) query["reference.entityType"] = entityType;
    if (entityId) query["reference.entityId"] = entityId;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const safeSkip = Math.max(parseInt(skip, 10) || 0, 0);

    const movements = await StockMovement.find(query)
      .sort({ createdAt: -1 })
      .skip(safeSkip)
      .limit(safeLimit)
      .populate("product")
      .populate("warehouse")
      .populate("createdBy", "-password");

    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStockMovementById = async (req, res) => {
  try {
    const movement = await StockMovement.findById(req.params.movementId)
      .populate("product")
      .populate("warehouse")
      .populate("createdBy", "-password");

    if (!movement) return res.status(404).json({ message: "Stock movement not found" });

    res.json(movement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
