import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkUser
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect ,checkUser)

export default router;
