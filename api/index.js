import express from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

import cors from "cors";

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import jwt from "jsonwebtoken";
import User from "./models/user.js";

const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❗️ Error connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("✅ Server is running on 3000 ");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.exists({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email,
      name,
      password,
    });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res
      .status(200)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.log("Error register user", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "handygym1932@gmail.com",
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: "matchmake.com",
    to: email,
    subject: "Email verification",
    text: `Please click on the following link to verify your email : http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending the verification email ");
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const verificationToken = req.params.token;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      res.status(400).json({ message: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error on verify email");
    return res.status(500).message({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error on login", error);
    return res.status(500).json({ message: "Log in failed" });
  }
});

app.put("/users/:userId/gender", async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;

    console.log(userId);
    console.log(gender);

    const user = await User.findByIdAndUpdate(
      userId,
      { gender },
      { new: true }
    );

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "user gender updating succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user gender", error });
  }
});
