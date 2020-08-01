let _io;
// module.exports = (io) => {
//   ios = io;
//   io.on("connection", (socket) => {
//     console.log("d");
//     socket.on("new", (data) => {
//       io.emit("notification", data);
//     });
//   });

//   newOrder = (data) => {
//     io.emit("newOrder", data);
//   };
// };

class Socket {
  async connect(io) {
    const orderController = require("../controllers/orders");
    io.on("connection", async (socket) => {
      // console.log("conecto");
      // console.log(socket);
      socket.on("updateDashboard", async () => {
        await orderController.sendDataDashboard();
      });
    });
    _io = io;
  }

  newOrder(data) {
    _io.emit("newOrder", data);
  }

  newOrderDashboard(data) {
    _io.emit("newOrderDashboard", data);
  }
}

module.exports = new Socket();
