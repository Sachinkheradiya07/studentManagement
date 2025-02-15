import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
  },
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [20, "Name must not exceed 50 characters"],
    match: [/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"],
  },
  role: {
    type: String,
    default: "Student",
    immutable: true,
  },
  fatherName: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [20, "Name must not exceed 50 characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Father's name must contain only letters and spaces",
    ],
  },
  motherName: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [20, "Name must not exceed 50 characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Mother's name must contain only letters and spaces",
    ],
  },
  contactNo: {
    type: Number,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Contact number must be 10 digits"],
  },
  DOB: {
    type: String,
    required: true,
    match: [
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Date of Birth must be in dd/mm/yyyy format.",
    ],
  },
  address: {
    street: {
      type: String,
      required: [true, "Street is required"],
      minlength: [3, "Street must be at least 3 characters long"],
      maxlength: [50, "Street must not exceed 50 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      minlength: [3, "City must be at least 3 characters long"],
      maxlength: [50, "City must not exceed 50 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      minlength: [3, "State must be at least 3 characters long"],
      maxlength: [50, "State must not exceed 50 characters"],
    },
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Gender is required"],
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  class: {
    type: Number,
    required: true,
    min: [1, "Class must be at least 1"],
    max: [12, "Class must be at most 12"],
  },
  subjects: {
    type: [String],
    default: ["Hindi", "English", "Gujarati", "Sanskrit", "Science"],
  },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
