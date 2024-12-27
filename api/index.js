import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { handleSocketEvents } from "./socket/index.js";
import morgan from "morgan";

dotenv.config();

const app = express();
export const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/users", userRoutes);
app.use("/meetings", meetingRoutes);

connectDB();

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

handleSocketEvents(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
