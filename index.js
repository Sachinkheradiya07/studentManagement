import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import staffRoute from "./routes/staff.route.js";
import studentRoute from "./routes/studend.routes.js";
import teacherRoute from "./routes/teacher.route.js";

dotenv.config();
const app = express();
const port = 8080;

const dbUrl = process.env.COMPASS_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
main();

app.use(express.json());

app.use("/staff", staffRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
