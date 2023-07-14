var express = require('express');
var router = express.Router();
const config = require('config');

var attachCurrentUser = require('../middlewares/attachCurrentUser');
var isAuth = require('../middlewares/isAuth');

const version = config.get('version');
const env = config.get('env');
const doc = config.get('document');


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(process.env.APP_COMMIT_VERSION);
  res.send({
    name: 'DevOps Admin Portal',
    version: version,
    env: env,
    document: doc,
    commit_number: process.env.APP_COMMIT_VERSION
    });
});

module.exports = router;
