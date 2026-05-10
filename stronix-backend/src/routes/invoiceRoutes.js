import express from "express";
import { createInvoice, markInvoicePaid } from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), createInvoice);
router.put("/pay/:invoiceId", protect, authorize("ADMIN"), markInvoicePaid);

export default router;