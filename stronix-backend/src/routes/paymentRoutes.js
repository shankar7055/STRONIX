import express from 'express';
import { initiatePayment, paymentSuccess } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", protect, initiatePayment);
router.put("/success/:paymentId", protect, paymentSuccess);

export default router;