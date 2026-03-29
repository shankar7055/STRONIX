import express from 'express';
import { initiatePayment, paymentFailed, paymentSuccess, refundPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", protect, initiatePayment);
router.put("/success/:paymentId", protect, paymentSuccess);
router.put("/failed/:paymentId", protect, paymentFailed);
router.put("/refund/:orderId", protect, refundPayment);

export default router;