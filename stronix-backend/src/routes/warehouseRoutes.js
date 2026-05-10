import express from "express";
import {
  createWarehouse,
  getWarehouseById,
  getWarehouses,
  updateWarehouse
} from "../controllers/warehouseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), createWarehouse);
router.get("/", protect, authorize("ADMIN"), getWarehouses);
router.get("/:warehouseId", protect, authorize("ADMIN"), getWarehouseById);
router.put("/:warehouseId", protect, authorize("ADMIN"), updateWarehouse);

export default router;
