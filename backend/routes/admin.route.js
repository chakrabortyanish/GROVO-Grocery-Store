import express from "express";
import { loginAdmin, signupAdmin } from "../controllers/admin.controller.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.get("/dashboard", getDashboardStats);
export {router as adminRouter}