const mysql = require("mysql");
const env = require("../.env.js");
const { nanoid } = require("nanoid");

class Api {
  constructor() {
    this.url = "";
    this.connection = null;

    this._setupConnection();
  }

  _setupConnection() {
    this.connection = mysql.createConnection({
      host: "0.0.0.0",
      user: env.MYSQL_USER,
      password: env.MYSQL_PASS,
    });

    this.connection.connect((err) => {
      if (err) throw err;
      console.log("::Connected to mysql");

      this._setupDB();
    });
  }

  _setupDB() {
    let shouldCreateDB = false;

    this.connection.query("SHOW DATABASES LIKE 'urls'", (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        this._createDatabase();
      }
    });
  }

  _createDatabase() {
    this.connection.query("CREATE DATABASE urls", (err, result) => {
      if (err) throw err;
      console.log("::Database created");
      this._createTable();
    });
  }

  _createTable() {
    this.connection.changeUser({ database: "urls" }, (err) => {
      if (err) throw err;
      this.connection.query(
        "CREATE TABLE urls (id VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL)",
        (err, result) => {
          if (err) throw err;
          console.log("::Table created");
        }
      );
    });
  }

  shorten(url) {
    const id = nanoid().slice(0, 7).replace(/\W/g, "");
    this.store(id, url);
    return id;
  }

  store(id, url) {
    this.connection.changeUser({ database: "urls" }, (err) => {
      if (err) throw err;

      this.connection.query(
        `INSERT INTO urls (id, url) VALUES ('${id}', '${url}')`,
        (err, result) => {
          if (err) throw err;
          console.log("::Inserted into urls table");
        }
      );
    });
  }

  get(id, cb) {
    this.connection.changeUser({ database: "urls" }, (err) => {
      if (err) throw err;

      this.connection.query(
        `SELECT url FROM urls WHERE id='${id}'`,
        (err, result) => {
          if (err) throw err;
          console.log("::Got url from urls table");
          cb(result);
        }
      );
    });
  }
}

module.exports = Api;
