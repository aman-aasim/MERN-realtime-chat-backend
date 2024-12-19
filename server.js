const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const largeDataRoutes = require("./routes/largedataRoutes");

const Message = require("./models/Chat");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const users = {};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/data", largeDataRoutes);

io.on("connection", (socket) => {

  socket.on("register_user", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("send_message", async (data) => {
    const message = new Message({
      sender: data.sender,
      receiver: data.receiver,
      content: data.content,
    });

    await message.save();

    const receiverSocketId = users[data.receiver];

    if (receiverSocketId) {

      io.to(receiverSocketId).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {

    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
