import express from "express"
import { signInUser, signUpUser, deleteUser, logOutUser } from "../controllers/User.js";
import { verifyToken } from "../middleware/auth.middleware.js";
// import { signUpValidation, logInValidation } from "../middleware/userValidation.js";

export const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", signInUser);
router.post("/logout", verifyToken, logOutUser);
router.delete("/delete", deleteUser);

