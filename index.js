require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const messageRoutes = require("./routes/messages");
const { initSocket } = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.json({ message: "ChatApp API is running!" }));

// Socket.io
initSocket(io);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
