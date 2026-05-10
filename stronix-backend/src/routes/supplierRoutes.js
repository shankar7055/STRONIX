import express from "express";
import { createSupplier, getSuppliers } from "../controllers/supplierController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect,authorize("ADMIN"), createSupplier);
router.get("/", protect,getSuppliers);

export default router;