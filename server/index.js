import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import busRoutes from "./routes/buses.js";
import vehicleRoutes from "./routes/vehicles.js";
import driverRoutes from "./routes/driver.js";
import notificationRoutes from "./routes/notifications.js";
import { initSocketHandler } from "./socket/socketHandler.js";
import { startBusSimulator } from "./simulation/busSimulator.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Connect DB
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", time: new Date().toISOString(), db: "json-file" }),
);

// Socket.IO & Simulation
initSocketHandler(io);
startBusSimulator(io);

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`\n🚌 NextBus 2.0 Server running on http://localhost:${PORT}`);
  console.log(
    `📡 Socket.IO ready | 🗄️  JSON DB active | 🚌 8 buses simulating\n`,
  );
});
