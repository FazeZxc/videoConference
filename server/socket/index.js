const userIdToSocketMapping = new Map();

export const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("join-room", (data) => {
      const { roomId, userId, userName } = data;
      console.log("User", userName, "joined room", roomId);
      userIdToSocketMapping.set(userId, socket.id);
      socket.join(roomId);
      socket.emit("joined-room", { roomId });
      socket.broadcast.to(roomId).emit("user-joined", { userId, userName });
    });

    socket.on("leave-room", (data) => {
      const { roomId, userId, userName } = data;
      console.log("User", userName, "left room", roomId);
      userIdToSocketMapping.delete(userId);
      socket.leave(roomId);
      socket.broadcast.to(roomId).emit("user-left", { userId, userName });
    });

    socket.on("message", (data) => {
      const { roomId, message, userId, userName } = data;
      console.log(
        `Message received in room ${roomId} from ${userName}:`,
        message
      );
      io.to(roomId).emit("message", { userId, userName, message });
    });

    socket.on("toggle-mic", (data) => {
      const { roomId, userId, micStatus } = data;
      let mic_mode = "ON";
      if (!micStatus) {
        mic_mode = "OFF";
      } else {
        mic_mode = "ON";
      }
      console.log(
        `User ${userId} in room ${roomId} turned ${mic_mode} their microphone`
      );
      socket.broadcast.to(roomId).emit("mic-toggled", { userId, micStatus });
    });

    socket.on("toggle-camera", (data) => {
      const { roomId, userId, cameraStatus } = data;
      console.log(
        `User ${userId} in room ${roomId} toggled camera: ${cameraStatus}`
      );
      socket.broadcast
        .to(roomId)
        .emit("camera-toggled", { userId, cameraStatus });
    });

    socket.on("start-screen-share", (data) => {
      const { roomId, userId } = data;
      console.log(`User ${userId} started screen sharing in room ${roomId}`);
      socket.broadcast.to(roomId).emit("screen-share-started", { userId });
    });

    socket.on("stop-screen-share", (data) => {
      const { roomId, userId } = data;
      console.log(`User ${userId} stopped screen sharing in room ${roomId}`);
      socket.broadcast.to(roomId).emit("screen-share-stopped", { userId });
    });

    socket.on("raise-hand", (data) => {
      const { roomId, userId } = data;
      console.log(`User ${userId} raised their hand in room ${roomId}`);
      socket.broadcast.to(roomId).emit("hand-raised", { userId });
    });

    socket.on("lower-hand", (data) => {
      const { roomId, userId } = data;
      console.log(`User ${userId} lowered their hand in room ${roomId}`);
      socket.broadcast.to(roomId).emit("hand-lowered", { userId });
    });

    socket.on("offer", (offer, to) => {
      io.to(to).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, to) => {
      io.to(to).emit("answer", answer, socket.id);
    });

    socket.on("ice-candidate", (candidate, to) => {
      io.to(to).emit("ice-candidate", candidate, socket.id);
    });

    socket.on("disconnect", () => {
      console.log(`A user disconnected: ${socket.id}`);
      for (const [userId, mappedSocketId] of userIdToSocketMapping.entries()) {
        if (mappedSocketId === socket.id) {
          userIdToSocketMapping.delete(userId);
          console.log(`Cleaned up mapping for userId: ${userId}`);
          break;
        }
      }
    });
  });
};
