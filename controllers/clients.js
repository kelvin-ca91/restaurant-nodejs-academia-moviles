const clientsModels = require("../models/clients");
const utils = require("../helpers/utils");
class Clients {
  async listByIds(codsClients) {
    try {
      return await clientsModels.find(
        { _id: { $in: codsClients }, active: true },
        { _id: 1, nombres: 1, apellidos: 1 }
      );
    } catch (error) {
      throw "ERROR";
    }
  }

  async login(email, password) {
    try {
      return await clientsModels.findOne({
        email,
        password,
      });
    } catch (error) {
      throw "ERROR";
    }
  }

  async afterLogin(email) {
    try {
      const rowUser = await clientsModels.findOne(
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
}

module.exports = new Clients();
