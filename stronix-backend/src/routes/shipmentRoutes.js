import express from "express";
import { createShipment, updateShipmentStatus } from "../controllers/shipmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createShipment);
router.put("/:shipmentId", protect, updateShipmentStatus);

export default router;