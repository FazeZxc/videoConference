import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import initializeSocket from './socket/index.js';
import connectDB from './configs/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = initializeSocket(server);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});