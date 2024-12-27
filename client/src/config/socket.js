import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (meetingId) => {
  socketInstance = socket(import.meta.env.VITE_BACKEND_URL, {
    // auth: {
    //     token: localStorage.getItem('token')
    // }
    query: {
      meetingId,
    },
  });
  return socketInstance;
};

export const socketListener = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};

export const socketSender = (eventName, data) => {
  socketInstance.emit(eventName, data);
};
