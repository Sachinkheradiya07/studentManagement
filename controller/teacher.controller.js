import Teacher from "../models/teacherSchema.js";

export const registerTeacher = async (req, res) => {
  try {
    const teacherDetails = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const teacherData = new Teacher({
      userId: req.user._id,
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
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const teachers = await Teacher.find({ userId: req.user._id });
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
