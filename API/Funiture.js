const conn = require("../Conn");
const Joi = require("@hapi/joi");

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).max(1000000000).required(),
    category: Joi.string().required(),
    sub_category: Joi.valid(),
    information: Joi.valid(),
  });
  return schema.validate(data.body);
}

exports.get = (req, res) => {
  conn.query("SELECT * FROM funitures", (err, result) => {
    if (err) return res.status(500).send(err);
    else res.status(200).send(result);
  });
};

exports.show = (req, res) => {
  const id = req.params.id;
  conn.query(`SELECT * FROM funitures WHERE id = ${id}`, (err, result) => {
    if (err) return res.status(500).send(err);
    if (!result.length) return res.status(404).send(result);
    res.status(200).send(result);
  });
};

exports.create = async (req, res) => {
  if (req.session.loggedin) {
    const { value, error } = validate(req);
    if (error) return res.status(400).send(error.details[0].message);

    let information = null;
    if (value.information) {
      information = value.information.trim().split(/\n+/);
      delete value.information;
    }
    value.sub_category ? "" : (value.sub_category = null);
    //   return res.send(information);
    values = Object.values(value);
    const result = await conn
      .query(
        "INSERT INTO funitures (name,price,category,sub_category) VALUES (?)",
        [values]
      )
      .catch((e) => {
        return res.status(500).send(e);
      });

    for (const key in information) {
      if (information.hasOwnProperty(key)) {
        const specification = [result.insertId, information[key]];
        await conn
          .query(
            "INSERT INTO specifications (funiture_id,information) VALUES (?)",
            [specification]
          )
          .catch((e) => {
            return res.status(500).send(e);
          });
      }
    }
    res.send(result);
  } else {
    res.status(400).send([{ data: { loggedin: false } }]);
  }
};

exports.update = async (req, res) => {
  if (req.session.loggedin) {
    const { value, error } = validate(req);
    const id = req.params.id;
    let information = null;
    if (value.information) {
      information = value.information.trim().split(/\n+/);
      delete value.information;
    }
    if (error) return res.status(400).send(error.details[0].message);
    value.sub_category ? "" : (value.sub_category = null);
    //   change object to array
    values = Object.values(value);
    const result = await conn
      .query(`UPDATE funitures SET ? WHERE id = ${id}`, [value])
      .catch((e) => {
        return res.status(500).send(e);
      });

    await conn
      .query(`DELETE FROM specifications WHERE funiture_id = ${id}`)
      .catch((e) => {
        return res.status(500).send(e);
      }); //delete all row id

    for (const key in information) {
      if (information.hasOwnProperty(key)) {
        const specification = [id, information[key]];
        await conn
          .query(
            "INSERT INTO specifications (funiture_id,information) VALUES (?)",
            [specification]
          )
          .catch((e) => {
            res.status(500).send(e);
          }); //update specification
      }
    }
    res.status(200).send(result);
  } else {
    res.status(400).send([{ data: { loggedin: false } }]);
  }
};

exports.delete = (req, res) => {
  if (req.session.loggedin) {
    const id = req.params.id;
    conn.query(`DELETE FROM funitures WHERE id='${id}'`, (err, result) => {
      if (err) return res.status(500).send(err);
      if (!result.affectedRows)
        return res.status(404).send("Funiture Not Found");
      res.status(200).send(result);
    });
  } else {
    res.status(400).send([{ data: { loggedin: false } }]);
  }
};
