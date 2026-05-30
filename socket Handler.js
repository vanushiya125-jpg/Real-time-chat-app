const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Room = require("../models/Room");

const onlineUsers = new Map(); // socketId -> { userId, username, roomId }

const initSocket = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.user;
    console.log(`✅ ${user.username} connected (${socket.id})`);

    // Mark user online
    await User.findByIdAndUpdate(user._id, { isOnline: true });
    onlineUsers.set(socket.id, { userId: user._id.toString(), username: user.username });

    // Broadcast online status
    io.emit("user:online", { userId: user._id, username: user.username });

    // Join room
    socket.on("room:join", async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;

        socket.join(roomId);
        onlineUsers.get(socket.id).roomId = roomId;

        // Get online users in room
        const roomOnlineUsers = [...onlineUsers.values()]
          .filter((u) => u.roomId === roomId)
          .map((u) => ({ userId: u.userId, username: u.username }));

        socket.emit("room:users", roomOnlineUsers);

        // Notify others
        socket.to(roomId).emit("user:joined", {
          userId: user._id,
          username: user.username,
          message: `${user.username} joined the room`,
        });

        console.log(`📍 ${user.username} joined room ${room.name}`);
      } catch (err) {
        console.error(err);
      }
    });

    // Leave room
    socket.on("room:leave", async ({ roomId }) => {
      socket.leave(roomId);
      if (onlineUsers.get(socket.id)) {
        onlineUsers.get(socket.id).roomId = null;
      }
      socket.to(roomId).emit("user:left", {
        userId: user._id,
        username: user.username,
        message: `${user.username} left the room`,
      });
    });

    // Send message
    socket.on("message:send", async ({ roomId, content }) => {
      try {
        if (!content?.trim()) return;

        const message = await Message.create({
          content: content.trim(),
          sender: user._id,
          room: roomId,
        });

        await message.populate("sender", "username isOnline");

        io.to(roomId).emit("message:receive", message);
        console.log(`💬 ${user.username}: ${content.trim()}`);
      } catch (err) {
        console.error(err);
      }
    });

    // Typing
    socket.on("typing:start", ({ roomId }) => {
      socket.to(roomId).emit("typing:update", { userId: user._id, username: user.username, isTyping: true });
    });

    socket.on("typing:stop", ({ roomId }) => {
      socket.to(roomId).emit("typing:update", { userId: user._id, username: user.username, isTyping: false });
    });

    // Disconnect
    socket.on("disconnect", async () => {
      const userData = onlineUsers.get(socket.id);
      if (userData?.roomId) {
        socket.to(userData.roomId).emit("user:left", {
          userId: user._id,
          username: user.username,
          message: `${user.username} disconnected`,
        });
      }

      onlineUsers.delete(socket.id);
      await User.findByIdAndUpdate(user._id, { isOnline: false, lastSeen: new Date() });
      io.emit("user:offline", { userId: user._id });

      console.log(`❌ ${user.username} disconnected`);
    });
  });
};

module.exports = { initSocket };
