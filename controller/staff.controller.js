import Staff from "../models/staff.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

    const token = crypto.randomBytes(32).toString("hex"); // Normal token
    const refreshToken = crypto.randomBytes(32).toString("hex"); // Refresh token

    //(7 days)
    const refreshTokenExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await Staff.updateOne(
      { _id: user._id },
      { refreshToken, refreshTokenExpiresAt }
    );

    return res.status(200).json({
      success: true,
      token,
      refreshToken,
      refreshTokenExpiresAt,
      role: user.role,
      message: `${user.role} logged in successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }
    const user = await Staff.findOne({ refreshToken });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
    if (Date.now() > user.refreshTokenExpiresAt) {
      return res.status(403).json({
        success: false,
        message: "Refresh token expired. Please log in again.",
      });
    }
    const newToken = crypto.randomBytes(32).toString("hex");
    return res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
