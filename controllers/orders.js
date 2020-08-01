const orderModel = require("../models/order");
const dishesController = require("../controllers/dishes");

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

      const dishesByKey = _.keyBy(dishesById, "_id");

      const newListDishes = dishes
        .filter((item) => dishesByKey[item.dish_id])
        .map((item) => ({
          dish_id: item.dish_id,
          price: dishesByKey[item.dish_id].price,
          cant: item.cant,
        }));
      if (newListDishes) {
        const order = {
          client_id,
          dishes: newListDishes,
          cant_dishes: _.sumBy(dishes, "cant"),
          price_total: _.sumBy(newListDishes, "price"),
          date: date ? date : undefined,
        };

        await orderModel.create(order);
        const lista = await this.list();
        sockets.newOrder(lista);
        await this.sendDataDashboard();
        return order;
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
      months.forEach((month) => {
        dataFinal.label.push(month);
      });
      for (const key in groupByDate) {
        if (groupByDate.hasOwnProperty(key)) {
          const data = [];
          months.forEach((month, i) => {
            data[i] = 0;
            for (const item of groupByDate[key]) {
              if (item.onlyMonth === i + 1) {
                data[i] = item.price_total;
              }
            }
          });
          dataFinal.data.push({ label: key, data });
        }
      }
      sockets.newOrderDashboard(dataFinal);
      // return dataFinal;
    } catch (error) {
      throw "ERROR";
    }
  }

  async list() {
    try {
      return await orderModel.find({}, { active: false, __v: false });
    } catch (error) {
      throw "ERROR";
    }
  }
}

module.exports = new Orders();
