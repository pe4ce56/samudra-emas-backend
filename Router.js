"use strict";

module.exports = (app) => {
  const funiture = require("./API/Funiture");
  app.get("/API/funitures", funiture.get);
  app.get("/API/funitures/:id", funiture.show);
  app.post("/API/funitures", funiture.create);
  app.put("/API/funitures/:id", funiture.update);
  app.delete("/API/funitures/:id", funiture.delete);
  app.post("/API/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      req.session.loggined = true;
      res.redirect("/API/funitures");
    } else {
      res.status(400).send([{ data: "please enter username and password" }]);
    }
    res.end();
  });
};
