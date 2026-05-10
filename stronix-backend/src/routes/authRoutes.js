import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Use controller handler so registration logic (validation, hashing, DB) runs
router.post("/register", register);
router.post("/login", login);

export default router;