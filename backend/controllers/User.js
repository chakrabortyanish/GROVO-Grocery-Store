import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists ,you have to login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Signup Successful", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // const user_name = await User.findOne({name});
    // console.log(user_name);
    // console.log("User Found:", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Email. Please sign up first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is not matched" });
    }

    // 3. Success
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const options = {
      httpOnly: true,
      /* secure: process.env.NODE_ENV === "production", // only true in production */
      secure: false,
      sameSite: "lax",
    };

    return res.status(200).cookie("token", token, options).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) { 
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const logOutUser = (req, res) => {
  console.log("Verified User: ", req.user.firstName);
  return res.status(200).clearCookie("token").json({ message: "Logout successful", success: true, });
};

const deleteUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // 3. Delete user
    await User.deleteOne({ email });

    return res
    .status(200)
    .clearCookie("token")
    .json({ message: "Account deleted successfully!", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { signUpUser, signInUser, deleteUser, logOutUser };
