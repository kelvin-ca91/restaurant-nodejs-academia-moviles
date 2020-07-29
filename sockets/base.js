let _io;
// module.exports = (io) => {
//   ios = io
//   io.on("connection", (socket) => {
//     socket.on("new", (data) => {
//       io.emit("notification", data);
//     });
//   });

//   newOrder = (data) => {
//     io.emit("newOrder", data);
//   };
// };

class Socket {
  connect(io) {
    io.on("connection", (socket) => {
      // socket.on("new", (data) => {
      //   io.emit("notification", data);
      // });
    });
    _io = io;
  }

  newOrder(data) {
    _io.emit("newOrder", data);
  }
}

module.exports = new Socket();
