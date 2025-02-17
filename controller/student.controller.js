import Student from "../models/student.model.js";

export const registerStudent = async (req, res) => {
  try {
    const studentDetails = req.body;
    const studentData = new Student({
      userId: req.user._id,
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
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
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
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
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
    const students = await Student.find({ userId: req.user._id });
    return res.status(200).json({ success: true, students });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
