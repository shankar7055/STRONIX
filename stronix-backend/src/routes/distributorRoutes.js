import express from "express";
import { createDistributor, getDistributors } from "../controllers/distributorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDistributor);
router.get("/", protect, getDistributors);

export default router;