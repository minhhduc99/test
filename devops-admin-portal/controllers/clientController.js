const Mdl = require('../models/client');
const config = require('config');
const User = require('../models/user');

const controllerName = 'clientController';

// Display list on get
exports.list_get = async function(req, res) {
  console.log(controllerName + ' - list - query = %s', JSON.stringify(req.query));
  var limit = req.query.limit;
  var offset = req.query.offset;
  // get all
  try {
    var params = {
      limit: limit,
      offset: offset
    };
    var r = await Mdl.getAll(params);
    var c = await Mdl.count();
    var count = c['count(*)'];
    var result = {
      count: count,
      data: r
    };
    console.log(result)
    res.send (JSON.stringify(result));
  } catch (err) {
    console.log(err);
    res.send (JSON.stringify(err));
  }
};


// Handle create on POST.
exports.create_post = async function(req, res) {
  console.log(controllerName + ' - create_post - body = %s', JSON.stringify(req.body, null, 4));

  var item = {};
  for(var i=0; i<Mdl.columns.keys.length; i++) {
    item[Mdl.columns.keys[i]] = req.body[Mdl.columns.keys[i]];
  }
  // create
  try {
    var result = await Mdl.create(item);
    res.send (JSON.stringify(result));
  } catch (err) {
    if(err && err.errno == 19) {
      res.json({
        result: 'error',
        message: 'Check Client Name (may be existed)!'
      }).status(400).end();
    } else {
      res.json({
        result: 'error',
        message: JSON.stringify(err)
      }).status(400).end();
    }
  }
};

// Handle update on POST.
exports.update_post = async function(req, res) {
  console.log(controllerName + ' - update_post - body = %s', JSON.stringify(req.body, null, 4));
  var id = req.body.id;
  if(id) {
    try {
      var item = await Mdl.getById(id);
      for(var i=0; i<Mdl.columns.keys.length; i++) {
        item[Mdl.columns.keys[i]] = req.body[Mdl.columns.keys[i]];
      }
      var result = await Mdl.update(item);
      res.send (JSON.stringify(result));
    } catch (err) {
      res.json(err).status(400).end();
    }
  } else {
    res.json({error: 'id is required'}).status(400).end();
  }
};


// Handle update status on POST.
exports.update_status_post = async function(req, res) {
  console.log(controllerName + ' - update_post - body = %s', JSON.stringify(req.body, null, 4));
  var id = req.body.id;
  var status = req.body.status;
  if(id && status) {
    try {
      var result = await Mdl.updateStatus(id, status);
      res.send (JSON.stringify(result));
    } catch (err) {
      res.json(err).status(400).end();
    }
  } else {
    res.json({error: 'id and status are required'}).status(400).end();
  }
};
