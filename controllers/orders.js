const orderModel = require("../models/order");
const dishesController = require("../controllers/dishes");

const sockets = require("../sockets/base");
const _ = require("lodash");
class Orders {
  async create({ client_id, dishes }) {
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
        };
        sockets.newOrder(order);
        return await orderModel.create(order);
      }
      throw "ERROR";
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
