import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

// opt configuration
import otpGenerator from "otp-generator";
import sendOTP from "../utils/sendOTP.js";

const userData = async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email varified",
      user: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await User.create({
      firstName,

      lastName,

      email,

      password: hashedPassword,

      otp,

      otpExpires: Date.now() + 1 * 60 * 1000,

      isVerified: false,
    });

    await sendOTP(email, otp);

    return res.status(201).json({
      success: true,

      message: "OTP sent to your email.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
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

    // verify opt
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first.",
      });
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
      { expiresIn: "7d" },
    );

    const options = {
      httpOnly: true,
      /* secure: process.env.NODE_ENV === "production", // only true in production */
      secure: true, // Required for HTTPS (Render)
      sameSite: "none", // Required for cross-site cookies (Vercel -> Render)
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

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.otp = "";

    user.otpExpires = null;

    await user.save();

    return res.json({
      success: true,

      message: "Email verified successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Optional: Don't resend if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    user.otp = otp;
    user.otpExpires = Date.now() + 60 * 1000; // 1 minute

    await user.save();

    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const logOutUser = (req, res) => {
  // console.log("Verified User: ", req.user.firstName);
  return res
    .status(200)
    .clearCookie("token")
    .json({ message: "Logout successful", success: true });
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

export {
  userData,
  signUpUser,
  signInUser,
  deleteUser,
  logOutUser,
  verifyOTP,
  resendOTP,
};
