const mysql = require("mysql");
const util = require("util");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "samudra_emas_new",
});
conn.query = util.promisify(conn.query);

module.exports = conn;
