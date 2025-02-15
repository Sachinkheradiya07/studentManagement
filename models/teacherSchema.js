import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
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
    default: "Teacher",
    immutable: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Gender is required"],
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
  classes: [
    {
      type: Number,
      min: [1, "Class must be at least 1"],
      max: [12, "Class must be at most 12"],
      required: [true, "At least one class must be assigned"],
    },
  ],
  subjects: {
    type: [String],
    default: ["Hindi", "English", "Gujarati", "Sanskrit", "Science"],
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
