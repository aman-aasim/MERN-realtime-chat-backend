const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json({ users });

  } catch (error) {

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
