import express from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

dotenv.config();

const app = express();
const port = 3000;

const http = createServer(app);
const io = new Server(http);

import cors from "cors";

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Chat from "./models/message.js";

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

    const user = await User.findByIdAndUpdate(
      userId,
      { gender },
      { new: true }
    );

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

app.put("/users/:userId/description", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        description,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User description succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user description" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user details" });
  }
});

app.put("/users/:userId/turn-ons/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { turnOns: turnOn },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User turn ons added succesfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error adding turn ons" });
  }
});

app.put("/users/:userId/turn-ons/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { turnOns: turnOn },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User turn ons removed succesfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error removing turn ons" });
  }
});

app.put(`/users/:userId/looking-for/add`, async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Looking for updaing successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error adding looking for", error });
  }
});

app.put("/users/:userId/looking-for/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Looking for removing successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing looking for", error });
  }
});

app.post("/users/:userId/profile-images", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user?.profileImages.push(imageUrl);
    await user.save();

    return res.status(200).json({ message: "imaeg has been added", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding the profile image", error });
  }
});

app.get("/profiles", async (req, res) => {
  try {
    const { userId, gender, lookingFor, turnOns } = req.query;
    console.log(req.query);

    let filter = { gender: gender === "male" ? "female" : "male" };
    if (turnOns) {
      filter.turnOns = { $in: turnOns };
    }
    if (lookingFor) {
      filter.lookingFor = { $in: lookingFor };
    }
    const currentUser = await User.findById(userId)
      .populate("matches", "_id")
      .populate("crushes", "_id");

    const friendIds = currentUser.matches.map((friend) => friend._id);
    const crushIds = currentUser.crushes.map((crush) => crush._id);
    const profiles = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...crushIds]);

    return res.status(200).json({ profiles });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user profiles", error });
  }
});

app.post("/send-like", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { receivedLikes: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { crushes: selectedUserId },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: "Error sending a like", error });
  }
});

app.get("/received-likes/:userId/details", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receivedLikesArray = [];

    for (const likedUserId of user.receivedLikes) {
      const likeUser = await User.findById(likedUserId);
      if (likeUser) {
        receivedLikesArray.push(likeUser);
      }
    }

    return res.status(200).json({ receivedLikesArray });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error receiving the details", error });
  }
});

app.post("/create-match", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: {
        matches: currentUserId,
      },
      $pull: {
        crushes: currentUserId,
      },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: {
        matches: selectedUserId,
      },
      $pull: {
        receivedLikes: selectedUserId,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: "Error creating the match", error });
  }
});

app.get("/users/:userId/matches", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchIds = user.matches;

    const matches = await User.find({ _id: { $in: matchIds } });

    return res.status(200).json({ matches });
  } catch (error) {
    return res.status(500).json({ message: "Error retreiving the matches" });
  }
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      console.log("data", data);
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      // emit the message the receiver
      io.to(receiverId).emit("receiverMessage", newMessage);
    } catch (error) {
      console.log("error handling the message");
    }
  });

  socket.on("disconnet", () => {
    console.log("user disconnected");
  });
});

http.listen(8000, () => {
  console.log("Socket.io server running on port 8000");
});

app.get("/messages", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    console.log(senderId);
    console.log(receiverId);

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Error in geting messages", error });
  }
});
