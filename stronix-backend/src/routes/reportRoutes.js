import express from "express";
import { getSalesReport, getInventoryReport, getSupplierReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/sales", protect, authorize("ADMIN"), getSalesReport);
router.get("/inventory", protect, authorize("ADMIN"), getInventoryReport);
router.get("/suppliers", protect, authorize("ADMIN"), getSupplierReport);

export default router;