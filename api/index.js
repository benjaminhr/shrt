const mysql = require("mysql");

class Api {
  static connection = null;

  static shorten(url) {
    return url;
  }

  static store(url) {
    if (connection == null) {
      console.error("");
    }
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
    });
  }

  static get(url) {}
}

module.exports = Api;
