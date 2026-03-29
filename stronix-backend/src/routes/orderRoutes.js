import express from "express";
import { createOrder, confirmOrder, cancelOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.put("/confirm/:orderId", protect, confirmOrder);
router.put("/cancel/:orderId", protect, cancelOrder);

export default router;