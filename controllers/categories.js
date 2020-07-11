const categoriesModels = require("../models/categories");

class Category {
  async create({ name, description }) {
    try {
      return await categoriesModels.create({
        name,
        description,
      });
    } catch (error) {
      throw "ERROR";
    }
  }

  async list() {
    try {
      return await categoriesModels.find(
        {},
        {
          _id: 1,
          name: 1,
          description: 1,
          active: 1,
        }
      );
    } catch (error) {
      throw "ERROR";
    }
  }

  async destroy(_id) {
    try {
      await categoriesModels.updateOne(
        {
          _id,
        },
        { $set: { active: false } }
      );
    } catch (error) {
      throw "ERROR";
    }
  }

  async update({ _id, name, description }) {
    try {
      return await categoriesModels.updateOne(
        { _id },
        {
          $set: {
            name,
            description,
          },
        }
      );
    } catch (error) {
      throw "ERROR";
    }
  }

  async show(_id) {
    try {
      return await categoriesModels.findById(_id, {
        _id: 1,
        name: 1,
        description: 1,
      });
    } catch (error) {
      throw "ERROR";
    }
  }

  async listByIds(codsCategory) {
    try {
      return await categoriesModels.find(
        { _id: { $in: codsCategory } },
        { _id: 1, name: 1, status: 1 }
      );
    } catch (error) {}
  }
}

module.exports = new Category();
