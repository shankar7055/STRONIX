import express from "express";
import {
  getStockMovementById,
  listStockMovements
} from "../controllers/stockMovementController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), listStockMovements);
router.get("/:movementId", protect, authorize("ADMIN"), getStockMovementById);

export default router;
