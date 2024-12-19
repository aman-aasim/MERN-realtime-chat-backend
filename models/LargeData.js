const mongoose = require("mongoose");

const largeDataSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: String,
  timestamp: Date,
  status: String,
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isEncrypted: Boolean,
  isDeleted: Boolean,
});

module.exports = mongoose.model("LargeData", largeDataSchema);
