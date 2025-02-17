import { Router } from "express";
import {
  verifyAdminAndTeacher,
  verifyAdmin,
} from "../middleware/varifyAdmin.js";
import { authenticateToken } from "../middleware/authmiddleware.js";
import {
  registerStudent,
  updateStudentdata,
  deleteStudent,
  getStudentById,
  getAllStudents,
} from "../controller/student.controller.js";

const router = Router();

router.post("/register", authenticateToken, verifyAdmin, registerStudent);
router.put(
  "/update/:id",
  authenticateToken,
  verifyAdminAndTeacher,
  updateStudentdata
);
router.delete("/delete/:id", authenticateToken, verifyAdmin, deleteStudent);
router.get("/get/:id", authenticateToken, verifyAdmin, getStudentById);
router.get("/getall", authenticateToken, verifyAdmin, getAllStudents);

export default router;
