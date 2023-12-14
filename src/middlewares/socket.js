const socketIo = require("socket.io");
const config = require("../config/config");

let io;

const initSocketIo = (httpServer) => {
  io = socketIo(httpServer, {
    cors: {
      origin: [config.devUrl, config.mainUrl],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
};

const getIoInstance = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocketIo, getIoInstance };
