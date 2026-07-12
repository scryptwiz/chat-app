const Message = require("../models/Message");

const onlineUsers = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join", (username) => {
      onlineUsers.set(socket.id, username);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });

    socket.on("sendMessage", async (data) => {
      try {
        const message = await Message.create({
          username: data.username,
          text: data.text,
        });
        io.emit("newMessage", message);
      } catch (err) {
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("typing", (username) => {
      socket.broadcast.emit("userTyping", username);
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("userStoppedTyping");
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
