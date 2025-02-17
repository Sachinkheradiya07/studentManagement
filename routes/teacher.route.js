import express from "express";
import { authenticateToken } from "../middleware/authmiddleware.js";
import { verifyAdmin } from "../middleware/varifyAdmin.js";
import {
  registerTeacher,
  updateTeacherData,
  deleteTeacher,
  getTeacherById,
  getAllTeachers,
} from "../controller/teacher.controller.js";

const router = express.Router();

router.post("/register", authenticateToken, verifyAdmin, registerTeacher);
router.put("/update/:id", authenticateToken, verifyAdmin, updateTeacherData);
router.delete("/delete/:id", authenticateToken, verifyAdmin, deleteTeacher);
router.get("/get/:id", authenticateToken, verifyAdmin, getTeacherById);
router.get("/getall", authenticateToken, verifyAdmin, getAllTeachers);

export default router;
