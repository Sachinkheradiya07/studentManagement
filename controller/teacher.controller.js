import Teacher from "../models/teacherSchema.js";
import Staff from "../models/staff.model.js";

const verifyAdmin = async (token) => {
  if (!token) {
    throw new Error("Unauthorized: Token required");
  }
  const admin = await Staff.findOne({ token });
  if (!admin) {
    throw new Error("Admin Not Found");
  }
  if (admin.role !== "admin") {
    throw new Error("Unauthorized: Only admins can perform this action");
  }
  return admin;
};

export const registerTeacher = async (req, res) => {
  try {
    const admin = await verifyAdmin(req.headers.token);
    const teacherDetails = req.body;
    const teacherData = new Teacher({
      userId: admin._id,
      ...teacherDetails,
    });
    await teacherData.save();
    return res.status(201).json({ message: "Teacher Registered Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateTeacherData = async (req, res) => {
  try {
    const admin = await verifyAdmin(req.headers.token);
    const { id } = req.params;
    const updatedData = req.body;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Teacher Updated Successfully", updatedTeacher });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const admin = await verifyAdmin(req.headers.token);
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }
    await Teacher.findByIdAndDelete(id);
    return res.status(200).json({ message: "Teacher Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const admin = await verifyAdmin(req.headers.token);
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }
    return res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const admin = await verifyAdmin(req.headers.token);
    const teachers = await Teacher.find({ userId: admin._id });
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
