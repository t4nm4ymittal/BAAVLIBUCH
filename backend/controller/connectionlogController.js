const connectionlogModel = require("../models/connectionlogModel");

module.exports.logconnection=async function logconnection(req, res, next) {
  try {
    let connection = await connectionlogModel.findOne({});

    if (!connection) {
      
      connection = new connectionlogModel({ count: 1 });
    } else {
      
      connection.count += 1;
    }
    connection.save();
    next();
    console.log(connection.count)
  } catch (err) {
    console.error(err);
  }
}


