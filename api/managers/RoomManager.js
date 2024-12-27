import { v4 as uuidv4 } from "uuid"; 

export class RoomManager {
  constructor() {
    this.rooms = new Map(); 
  }

  createRoom(user1, user2) {
    const roomId = this.generateRoomId();
    this.rooms.set(roomId, {
      participants: [user1, user2],
    });

    [user1, user2].forEach((user) =>
      user.socket.emit("send-offer", { roomId })
    );

    console.log(`Room created with ID: ${roomId}`);
  }

  onOffer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return;
    }

    const receivingUser = room.participants.find(
      (user) => user.socket.id !== senderSocketId
    );

    receivingUser?.socket.emit("offer", { sdp, roomId });
  }

  onAnswer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return;
    }

    const receivingUser = room.participants.find(
      (user) => user.socket.id !== senderSocketId
    );

    receivingUser?.socket.emit("answer", { sdp, roomId });
  }

  onIceCandidates(roomId, senderSocketId, candidate, type) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return;
    }

    const receivingUser = room.participants.find(
      (user) => user.socket.id !== senderSocketId
    );

    receivingUser?.socket.emit("add-ice-candidate", { candidate, type });
  }

  removeRoom(roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.delete(roomId);
      console.log(`Room with ID: ${roomId} removed`);
    } else {
      console.error(`Attempted to remove non-existent room: ${roomId}`);
    }
  }

  handleUserDisconnect(socketId) {
    for (const [roomId, room] of this.rooms.entries()) {
      const userIndex = room.participants.findIndex(
        (user) => user.socket.id === socketId
      );

      if (userIndex !== -1) {
        const disconnectedUser = room.participants[userIndex];
        room.participants.splice(userIndex, 1); // Remove user from room

        console.log(
          `User ${disconnectedUser.socket.id} disconnected from room: ${roomId}`
        );

        room.participants.forEach((user) =>
          user.socket.emit("user-disconnected", { userId: disconnectedUser.userId })
        );

        if (room.participants.length === 0) {
          this.removeRoom(roomId);
        }
        return;
      }
    }
  }

  generateRoomId() {
    return uuidv4();
  }
}
