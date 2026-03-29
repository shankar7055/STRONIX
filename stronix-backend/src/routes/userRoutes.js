import express from "express";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();


router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Profile accessed",
        user: req.user
    });
});


router.get("/admin", protect, authorize("ADMIN"), (req, res) => {
    res.json({
        message: "Welcome Admin"
    });
});



router.get("/", protect, authorize("ADMIN"), getAllUsers);

router.delete("/:userId", protect, authorize("ADMIN"), deleteUser);

router.put("/:userId/role", protect, authorize("ADMIN"), updateUserRole);

export default router;