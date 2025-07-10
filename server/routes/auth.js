const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
console.log(JWT_SECRET);
router.post("/register", async (req, res) => {
  const {
    username,
    password,
    email,
    role,
    mobileNumber,
    address,
    dob,
    gender,
  } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
      mobileNumber,
      address,
      dob: new Date(dob), // Convert string to Date
      gender,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Registration failed", error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful. Clear token on client-side." });
});

module.exports = router;
