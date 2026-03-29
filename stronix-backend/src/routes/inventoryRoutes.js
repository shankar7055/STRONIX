import express from "express";
import { addStock, getStock} from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), addStock);
router.get("/:productId", protect, getStock);

export default router;