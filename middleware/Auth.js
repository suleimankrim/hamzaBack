import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel.js";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = await jwt.verify(token, "secret");
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

export const OPTPlace = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};
export const emailVerifier = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const existUser = await UserModel.findOne({ email });
  if (!existUser) {
    return res.status(404).send({ message: "user not found" });
  }
  req.user = existUser;
  next();
};
export const emailRequestQueryVerifier = async (req, res, next) => {
  const { email } = req.query;
  console.log(email);
  if (!email) return res.status(404).send({ message: "you have no email" });
  try {
    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      return res.status(404).send({ message: "user not found" });
    }
    req.user = existUser;
    next();
  } catch (e) {
    console.log("lllllllllllllllllllll");
    return res.status(404).send({ message: e.message });
  }
};
