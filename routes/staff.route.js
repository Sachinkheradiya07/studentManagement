import { Router } from "express";
import {
  register,
  login,
  logoutUser,
  refreshToken,
} from "../controller/staff.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh_token", refreshToken);
router.post("/logout", logoutUser);

export default router;
