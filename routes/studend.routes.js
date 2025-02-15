import { Router } from "express";
import {
  registerStudent,
  updateStudentdata,
  deleteStudent,
  getStudentById,
  getAllStudents,
} from "../controller/student.controller.js";

const router = Router();

router.post("/register", registerStudent);
router.put("/update/:id", updateStudentdata);
router.delete("/delete/:id", deleteStudent);
router.get("/get/:id", getStudentById);
router.get("/getall", getAllStudents);

export default router;
