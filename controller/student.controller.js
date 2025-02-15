import Student from "../models/student.model.js";
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
const verifyAdminAndTeacher = async (token) => {
  if (!token) {
    throw new Error("Unauthorized: Token required");
  }
  const user = await Staff.findOne({ token });

  if (!user) {
    throw new Error("Author Not Found");
  }

  if (user.role !== "admin" && user.role !== "teacher") {
    throw new Error(
      "Unauthorized: Only admins and teachers can perform this action"
    );
  }
  return user;
};

export const registerStudent = async (req, res) => {
  try {
    const token = req.headers.token;
    const admin = await verifyAdmin(token);

    const studentDetails = req.body;
    const studentData = new Student({
      userId: admin._id,
      ...studentDetails,
    });
    await studentData.save();
    return res.status(201).json({ message: "Student Registered Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateStudentdata = async (req, res) => {
  try {
    const token = req.headers.token;
    const admin = await verifyAdminAndTeacher(token);

    const { id } = req.params;
    const updatedData = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Student Updated Successfully", updatedStudent });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const token = req.headers.token;
    const admin = await verifyAdmin(token);

    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }
    if (student.userId.toString() !== admin._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this student" });
    }
    await Student.findByIdAndDelete(id);
    return res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const token = req.headers.token;
    const admin = await verifyAdmin(token);

    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }
    if (student.userId.toString() !== admin._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this student" });
    }
    return res.status(200).json({ success: true, student });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const token = req.headers.token;
    const admin = await verifyAdmin(token);

    const students = await Student.find({ userId: admin._id });
    return res.status(200).json({ success: true, students });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
