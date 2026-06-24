import express from "express";
import { loginAdmin, signupAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

export {router as adminRouter}