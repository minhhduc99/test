const Config = require('config');
const Client = require('../models/client');

module.exports = async (req, res, next) => {
  try {
    if (req.headers.app) {
      let app = await Client.getByName(req.headers.app);
      //console.log(app);
      if(app) {
        req.app = app;
        return next();
      } else {
        res.status(401).end();
      }
    }
  } catch(e) {
  }
  return res.json(e).status(500);
}
