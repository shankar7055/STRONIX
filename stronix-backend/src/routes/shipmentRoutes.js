import express from "express";
import { createShipment, updateShipmentStatus, assignDistributor, markFailed } from "../controllers/shipmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createShipment);
router.put("/status/:shipmentId", protect, updateShipmentStatus);
router.put("/assign/:shipmentId", protect, assignDistributor);
router.put("/failed/:shipmentId", protect, markFailed);

export default router;