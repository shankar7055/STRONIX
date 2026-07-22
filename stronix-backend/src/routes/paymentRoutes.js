import express from 'express';
import { initiatePayment, paymentFailed, paymentSuccess, refundPayment, createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", protect, initiatePayment);
router.put("/success/:paymentId", protect, paymentSuccess);
router.put("/failed/:paymentId", protect, paymentFailed);
router.put("/refund/:orderId", protect, refundPayment);

router.post("/create", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);

export default router;