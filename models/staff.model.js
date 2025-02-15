import mongoose from "mongoose";
const Schema = mongoose.Schema;

const staffSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must not exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"],
    },
    role: {
      type: String,
      enum: ["teacher", "admin"],
      immutable: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/,
        "Please enter a valid Gmail, Yahoo, or Outlook email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
