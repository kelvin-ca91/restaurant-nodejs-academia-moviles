const orderModel = require("../models/order");
const dishesController = require("../controllers/dishes");
const clientsController = require("../controllers/clients");

const sockets = require("../sockets/base");
const _ = require("lodash");
const moment = require("moment");

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

class Orders {
  async create({ client_id, dishes, date }) {
    try {
      const dishesIds = _.uniq(dishes.map((item) => item.dish_id));
      const dishesById = await dishesController.listByIds(dishesIds);
      if (dishesById.length) {
        const dishesByKey = _.keyBy(dishesById, "_id");

        const newListDishes = dishes
          .filter((item) => dishesByKey[item.dish_id])
          .map((item) => ({
            dish_id: item.dish_id,
            price: dishesByKey[item.dish_id].price,
            cant: item.cant,
          }));
        const price_total = newListDishes.map((item) => ({
          price: item.price * item.cant,
        }));
        if (newListDishes) {
          const order = {
            client_id,
            dishes: newListDishes,
            cant_dishes: _.sumBy(dishes, "cant"),
            price_total: _.sumBy(price_total, "price"),
            date: date ? date : undefined,
          };

          const saveOrder = await orderModel.create(order);
          await this.list();
          await this.sendDataDashboard();
          return saveOrder;
        }
      }
      throw "ERROR";
    } catch (error) {
      throw "ERROR";
    }
  }

  async sendDataDashboard() {
    try {
      const dataFinal = {
        label: [],
        data: [],
      };

      const lista = await this.list();
      const listaNew = lista.map(
        ({ date, _id, dishes, cant_dishes, price_total }) => {
          return {
            date,
            _id,
            dishes,
            cant_dishes,
            price_total,
            onlyMonth: Number(moment(date).utc().format("M")),
            onlyYear: moment(date).utc().format("YYYY"),
          };
        }
      );
      const groupByDate = _.groupBy(listaNew, "onlyYear");
      months.forEach((month, i) => {
        dataFinal.label.push(month);
      });
      for (const key in groupByDate) {
        if (groupByDate.hasOwnProperty(key)) {
          const data = [];
          months.forEach((month, i) => {
            data[i] = 0;
            for (const item of groupByDate[key]) {
              if (item.onlyMonth === i + 1) {
                data[i] += item.price_total * item.cant_dishes;
              }
            }
          });
          dataFinal.data.push({ label: key, data });
        }
      }
      sockets.newOrderDashboard(dataFinal);

      return dataFinal;
    } catch (error) {
      throw "ERROR";
    }
  }

  async list() {
    try {
      const listOrders = await orderModel
        .find({}, { active: false, __v: false, "dishes._id": false })
        .sort({ date: -1 });
      const clientsId = listOrders.map((item) => item.client_id);
      const clientsIdsUniq = _.uniq(clientsId);
      const listClients = await clientsController.listByIds(clientsIdsUniq);
      const newListOrder = [];
      for (const order of listOrders) {
        const {
          client_id,
          date,
          _id,
          dishes,
          cant_dishes,
          price_total,
        } = order;
        const client = listClients.find(
          (item) => String(item._id) === client_id
        );
        if (client) {
          newListOrder.push({
            date,
            _id,
            client: client,
            dishes,
            cant_dishes: cant_dishes,
            price_total: price_total,
          });
        }
      }
      sockets.sendOrders(newListOrder);
      return newListOrder;
    } catch (error) {
      throw "ERROR";
    }
  }
}

module.exports = new Orders();
