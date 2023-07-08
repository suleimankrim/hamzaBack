import express from "express";
import {
  generateOTP,
  getAllUsers,
  getUserByEmail,
  getUserById,
  login,
  register,
  resetPassword,
  updateUser,
  verifyOTP,
} from "../controller/UserController.js";
import {
  emailRequestQueryVerifier,
  emailVerifier,
  OPTPlace,
  userAuth,
} from "../middleware/Auth.js";
import { sendMail } from "../mail/SendEmail.js";

const router = express.Router();
router.post("/", register);
router.post("/login", emailVerifier, login);
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/useremail/:email", getUserByEmail);
router.put("/update", userAuth, updateUser);
router.get("/sendCode", emailRequestQueryVerifier, OPTPlace, generateOTP);
router.get("/code", emailRequestQueryVerifier, verifyOTP);
router.post("/resetpassword", emailVerifier, resetPassword);
router.post("/mail", sendMail);
router.post("/email", emailVerifier, (req, res) => res.sendStatus(201));
export default router;
