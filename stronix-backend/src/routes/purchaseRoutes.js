import express from "express";
import { createPurchaseOrder, receivePurchaseOrder } from "../controllers/purchaseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), createPurchaseOrder);
router.put("/receive/:poId", protect, authorize("ADMIN"), receivePurchaseOrder);

export default router;