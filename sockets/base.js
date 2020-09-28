let _io;
class Socket {
  async connect(io) {
    const orderController = require("../controllers/orders");
    const administratorController = require("../controllers/auth");

    io.on("connection", async (socket) => {
      socket.on("loginUsuario", async (data) => {
        try {
          const { userId } = data;
          const { id } = socket;
          await administratorController.loginSocket(id, userId);
        } catch (error) {}
      });

      socket.on("disconnect", async () => {
        try {
          const { id } = socket;
          await administratorController.logoutSocket(id);
        } catch (error) {}
      });

      socket.on("registrarOrdenDeCompra", async (data) => {
        try {
          const { clientId, dishes } = data;
          await orderController.create(clientId, dishes);
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
