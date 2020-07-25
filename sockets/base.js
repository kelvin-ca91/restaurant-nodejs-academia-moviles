module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("notification", (data) => {
      io.emit("notification", data);
    });
  });
};
