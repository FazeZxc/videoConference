import { Server } from 'socket.io';
import Message from '../models/Message.js';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, 
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const rooms = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', async ({ roomId, userId, userName }) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId).add({ userId, userName, socketId: socket.id });
      socket.to(roomId).emit('user-connected', { userId, userName });

      const participants = Array.from(rooms.get(roomId));
      socket.emit('room-users', participants);
    });

    socket.on('chat-message', async ({ roomId, message, userId }) => {
      try {
        const newMessage = await Message.create({
          meeting: roomId,
          sender: userId,
          content: message,
        });

        io.to(roomId).emit('chat-message', {
          message,
          userId,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error saving chat message:', error);
      }
    });

    socket.on('disconnect', () => {
      rooms.forEach((participants, roomId) => {
        participants.forEach((participant) => {
          if (participant.socketId === socket.id) {
            participants.delete(participant);

            socket.to(roomId).emit('user-disconnected', participant.userId);

            if (participants.size === 0) {
              rooms.delete(roomId);
            }
          }
        });
      });
    });
  });

  return io;
};

export default initializeSocket;
