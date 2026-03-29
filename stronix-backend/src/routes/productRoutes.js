import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

// router.post("/", protect, authorize("ADMIN"), createProduct);
router.post("/", createProduct);


router.get("/test", (req, res) => {
  res.send("PRODUCT ROUTE WORKING");
});
export default router;