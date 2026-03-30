import express from "express";
import { viewInventory } from "../controllers/warehouseManagerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { dispachShipment } from "../controllers/shipmentController.js";

const router = express.Router();

router.get("/inventory", protect, authorize("WAREHOUSE_MANAGER"), viewInventory);
router.put(
  "/dispatch/:shipmentId",
  protect,
  authorize("WAREHOUSE_MANAGER"),
  dispachShipment
);

export default router;