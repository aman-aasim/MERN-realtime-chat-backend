const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

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
