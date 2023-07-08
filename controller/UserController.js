import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import bcrypto from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

export const register = async (req, res) => {
  const { email, password, username, profile } = req.body;
  console.log(req.body);
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  if (!password) {
    return res.status(400).json({ error: "You must provide a password" });
  }
  const hashedPass = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    email,
    username,
    password: hashedPass,
    profile: profile || "",
  });

  await newUser.save();
  return res.status(201).json({
    message: "User successfully registered",
    data: newUser,
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email)
    return res
      .status(400)
      .json({ message: "you must provide a password and email" });
  const existUser = req.user;
  const match = await bcrypt.compare(password, existUser["password"]);
  if (!match) return res.status(400).send({ message: "invalid password" });
  const token = jwt.sign({ _id: existUser["_id"], email }, "secret");
  res.status(201).send({
    message: "logged in successfully",
    data: existUser,
    token: token,
  });
};
export const getAllUsers = async (req, res) => {
  const allUser = await UserModel.find();
  return res.status(201).json(allUser);
};
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) return res.status(400).send({ message: "user not found" });
  const { password, ...restOb } = Object.assign({}, user.toJSON());
  return res.status(201).send(restOb);
};
export const updateUser = async (req, res) => {
  const id = req.user._id;
  if (!id) return res.status(400).send({ message: "user id is required" });
  const body = req.body;
  try {
    await UserModel.updateOne({ _id: id }, body);
    return res.status(201).send({ message: "user updated successfully" });
  } catch (e) {
    return res
      .status(400)
      .send({ message: "user not found", errorMessage: e.message });
  }
};
export const generateOTP = async (req, res) => {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return res.status(201).send({
    code: req.app.locals.OTP,
  });
};

export async function verifyOTP(req, res) {
  console.log(req.app.locals.OTP);
  console.log(req.query.code);
  if (!req.app.locals.OTP || !req.query.code)
    return res.status(400).send({ message: "you should provide a valid OTP" });
  if (parseInt(req.app.locals.OTP) === parseInt(req.query.code)) {
    req.app.locals.OTP = "";
    req.app.locals.resetSession = true;
    return res.status(201).send({ message: "success otp verification" });
  }
  return res.status(400).send({ message: "invalid otp" });
}

export const resetPassword = async (req, res) => {
  const exsitUser = req.user;
  try {
    const hashed = await bcrypto.hash(req.body.password, 10);
    await UserModel.updateOne({ email: exsitUser.email }, { password: hashed });
    return res.status(201).send({ message: "success reset password" });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};
export const getUserByEmail = async (req, res) => {
  const userEmail = req.params.email;
  try {
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) return res.status(400).send({ message: "user not found" });
    const { password, ...restOb } = Object.assign({}, user.toJSON());
    return res.status(201).send(restOb);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};
