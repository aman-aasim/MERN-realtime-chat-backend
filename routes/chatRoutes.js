const express = require("express");
const Chat = require("../models/Chat");

const router = express.Router();

// Fetch chat history between two users
router.get("/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;

  const chats = await Chat.find({
    $or: [
      { sender: userId, receiver: receiverId },
      { sender: receiverId, receiver: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(50); // Limit the results to the most recent 50 messages

  res.json(chats);
});

module.exports = router;
