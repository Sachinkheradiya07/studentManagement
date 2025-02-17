import Staff from "../models/staff.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const passwordRegex =
      /^[A-Z](?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{7,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must start with an uppercase letter, be at least 8 characters long, and include at least one number and one special character",
      });
    }
    const existingUser = await Staff.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    if (role === "admin") {
      const existingAdmin = await Staff.findOne({ role: "admin" });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ success: false, message: "Admin already exists" });
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Staff({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await Staff.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Staff.updateOne({ _id: user._id }, { refreshToken });

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      role: user.role,
      message: `${user.role} logged in successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// export const logoutUser = async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token. Please log in again.",
          });
        }

        const user = await Staff.findById(decoded.id);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        return res.status(200).json({
          success: true,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
