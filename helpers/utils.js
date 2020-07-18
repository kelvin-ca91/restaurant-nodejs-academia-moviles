const jwt = require("jsonwebtoken");

class Utils {
  encodeToken(data) {
    return jwt.sign({ data: data }, "AM");
  }

  decodeToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "AM", (err, info) => {
        if (err) {
          return reject(false);
        } else {
          return resolve(info);
        }
      });
    });
  }

  validarEmail(email) {
    const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    return re.test(email);
  }
}
module.exports = new Utils();
