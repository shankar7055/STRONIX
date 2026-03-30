import express from "express";
import { addStock, getStock, updateStock} from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), addStock);
router.get("/:productId", protect, getStock);
router.put(
  "/stock",
  protect,
  authorize("WAREHOUSE_MANAGER"),
  updateStock
);


export default router;