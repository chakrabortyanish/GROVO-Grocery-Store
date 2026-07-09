import express from "express"
import { userData, signInUser, signUpUser, deleteUser, logOutUser, verifyOTP, resendOTP } from "../controllers/User.js";
import { verifyToken } from "../middleware/auth.middleware.js";
// import { signUpValidation, logInValidation } from "../middleware/userValidation.js";

export const router = express.Router();

router.post("/",verifyToken, userData);
router.post("/signup", signUpUser);
router.post("/login", signInUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.post("/logout", logOutUser);
router.delete("/delete", deleteUser);

