const dishesModels = require("../models/dishes");
const categoriesModels = require("../models/categories");
const categoriesController = require("./categories");
const keyBy = require("lodash/keyBy");
class Dish {
  async create({ category_id, name, avatar, price, description }) {
    try {
      return await dishesModels.create({
        category_id,
        name,
        avatar,
        price,
        description,
      });
    } catch (error) {
      throw "ERROR";
    }
  }

  async list() {
    try {
      const listDishes = await dishesModels.find(
        {},
        {
          _id: 1,
          category_id: 1,
          name: 1,
          avatar: 1,
          price: 1,
          description: 1,
          active: 1,
        }
      );
      const codsCategory = listDishes.map((item) => item.category_id);
      const listCategories = await categoriesController.listByIds(codsCategory);

      const categoriesByKey = keyBy(listCategories, "_id");
      const result = listDishes
        .filter((item) => categoriesByKey[item.category_id])
        .map((item) => {
          const { _id, name, avatar, price, description, active } = item;
          return {
            _id,
            category: categoriesByKey[item.category_id],
            name,
            avatar,
            price,
            description,
            active,
          };
        });
      return result;
    } catch (error) {
      throw error._message;
    }
  }

  async destroy(_id) {
    try {
      await dishesModels.updateOne(
        {
          _id,
        },
        { $set: { active: false } }
      );
    } catch (error) {
      throw "ERROR";
    }
  }

  async update({ _id, category_id, name, avatar, price, description }) {
    try {
      const category = await categoriesModels.findById(category_id);
      const dish = await dishesModels.findById(_id);
      if (category && dish) {
        const body = {
          category_id,
          name,
          price,
          description,
        };
        if (avatar) {
          body.avatar = avatar;
        }
        return await dishesModels.updateOne(
          { _id },
          {
            $set: body,
          }
        );
      }
      throw "ERROR";
    } catch (error) {
      throw "ERROR";
    }
  }

  async show(_id) {
    try {
      const dish = await dishesModels.findById(_id, {
        _id: 1,
        category_id: 1,
        name: 1,
        avatar: 1,
        price: 1,
        description: 1,
        active: 1,
      });

      const categories = await categoriesController.listByIds([
        dish.category_id,
      ]);

      const { name, avatar, price, description, active } = dish;
      const result = {
        _id,
        category: categories[0],
        name,
        avatar,
        price,
        description,
        active,
      };

      return result;
    } catch (error) {
      throw "ERROR";
    }
  }
}

module.exports = new Dish();
