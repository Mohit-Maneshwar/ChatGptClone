const { Server } = require("socket.io");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("New Socket Connection:", socket.id);
  });
}

module.exports = initSocketServer;
