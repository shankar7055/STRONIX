import express from "express";
import { createOrder, confirmOrder, cancelOrder, getOrderById, getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.put("/confirm/:orderId", protect, confirmOrder);
router.put("/cancel/:orderId", protect, cancelOrder);


router.get("/my-orders", protect, getMyOrders);


router.get("/:orderId", protect, getOrderById);

export default router;