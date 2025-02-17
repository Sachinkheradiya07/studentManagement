// import jwt from "jsonwebtoken";
// import Staff from "../models/staff.model.js";

// export const authenticateToken = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await Staff.findById(decoded.id);

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res
//       .status(403)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// };
import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token expired. Please refresh your token.",
          });
        }
        return res
          .status(403)
          .json({ success: false, message: "Invalid token" });
      }

      const user = await Staff.findById(decoded.id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};
