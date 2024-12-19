const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, password, confirmPassword } = req.body;

    // Check if name is provided
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Name is required!" });
    }

    // Check if password length is at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long!" });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // Check if user with this mobile number already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const saltRounds = 12; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Proceed with creating the user here (e.g., hashing the password, saving user, etc.)
    const newUser = new User({
      name: name.trim(),
      mobile: mobile.trim(),
      password: hashedPassword, // You should hash the password before saving it!
    });

    await newUser.save();

    // Remove the password field before returning user details
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({ message: "User registered successfully!", user: userWithoutPassword });

  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  try {

    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });

  } catch (error) {

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
