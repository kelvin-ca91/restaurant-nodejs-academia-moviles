const administratorsModels = require("../models/administrators");
const utils = require("../helpers/utils");
class Auth {
  // Login
  async login(email, password) {
    try {
      return await administratorsModels.findOne({
        email,
        password,
      });
    } catch (error) {
      throw "ERROR";
    }
  }

  async afterLogin(email) {
    try {
      const rowUser = await administratorsModels.findOne(
        {
          email: email,
        },
        {
          password: false,
          active: false,
        }
      );
      const token = utils.encodeToken(rowUser);
      return {
        token,
      };
    } catch (error) {
      throw "ERROR";
    }
  }

  async loginSocket(socketId, userId) {
    try {
      return await administratorsModels.updateOne(
        { _id: userId },
        { $push: { socketId } }
      );
    } catch (error) {
      throw "ERROR";
    }
  }

  async logoutSocket(socketId) {
    try {
      return await administratorsModels.updateOne(
        { _id: userId },
        { $pull: { socketId } }
      );
    } catch (error) {
      throw "ERROR";
    }
  }
}

module.exports = new Auth();
