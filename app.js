"use-strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 8080;
const hostname = "0.0.0.0";
app.use(bodyParser.urlencoded({ extends: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
const router = require("./Router");
router(app);
app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}`);
});
