import { Router } from "express";
import {
  registerTeacher,
  updateTeacherData,
  deleteTeacher,
  getTeacherById,
  getAllTeachers,
} from "../controller/teacher.controller.js";

const router = Router();

router.post("/register", registerTeacher);
router.put("/update/:id", updateTeacherData);
router.delete("/delete/:id", deleteTeacher);
router.get("/get/:id", getTeacherById);
router.get("/getall", getAllTeachers);

export default router;
