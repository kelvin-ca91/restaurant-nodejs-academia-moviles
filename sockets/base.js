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
    const administratorController = require("../controllers/auth");

    io.on("connection", async (socket) => {
      socket.on("loginUsuario", async (data, callback) => {
        try {
          const { userId } = data;
          const { id } = socket;
          await administratorController.loginSocket(id, userId);
          // callback({ success: true });
        } catch (error) {
          // callback({ success: false });
        }
      });

      socket.on("disconnect", async (callback) => {
        try {
          const { id } = socket;
          await administratorController.logoutSocket(id);
          // callback({ success: true });
        } catch (error) {
          // callback({ success: false });
        }
      });

      socket.on("registrarOrdenDeCompra", async (data) => {
        try {
          const { clientId, dishes } = data;
          // const order =
          await orderController.create(clientId, dishes);
          // callback({ success: true, data: order });
        } catch (error) {}
      });
    });

    _io = io;
  }

  sendOrders(data) {
    _io.emit("ordersCompra", data);
  }

  newOrderDashboard(data) {
    _io.emit("ordersDashboard", data);
  }
}

module.exports = new Socket();
