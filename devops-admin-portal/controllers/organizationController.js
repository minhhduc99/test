var Org = require('../models/organization');
const config = require('config');

const controllerName = 'orgsController';

// Display list on get
exports.list_get = async function(req, res) {
  console.log(controllerName + ' - list - limit = %s', JSON.stringify(req.query.limit));
  var limit = req.query.limit;
  var offset = req.query.offset;
  // get all
  try {
    var c = await Org.count();
    var count = c['count(*)'];
    var params = {
      limit: limit,
      offset: offset,
      organization: null
    };
    var r = await Org.getAll(params);
    res.send (JSON.stringify({
      count: count,
      data: r
    }));
  } catch (err) {
    res.send (JSON.stringify(err));
  }
};


// Handle create on POST.
exports.create_post = async function(req, res) {
  console.log(controllerName + ' - create_post - body = %s', JSON.stringify(req.body, null, 4));

  var item = {};
  for(var i=0; i<Org.columns.keys.length; i++) {
    item[Org.columns.keys[i]] = req.body[Org.columns.keys[i]];
  }
  try {
    var result = await Org.create(item);
    res.send (JSON.stringify(result));
  } catch (err) {
    if(err && err.errno == 19) {
      res.json({
        result: 'error',
        message: 'Check Org Name (may be existed)!'
      }).status(400).end();
    } else {
      res.json({
        result: 'error',
        message: err
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
      var item = await Org.getById(id);
      for(var i=0; i<Org.columns.keys.length; i++) {
        item[Org.columns.keys[i]] = req.body[Org.columns.keys[i]];
      }
      var result = await Org.update(item);
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
      var result = await Org.updateStatus(id, status);
      res.send (JSON.stringify(result));
    } catch (err) {
      res.json(err).status(400).end();
    }
  } else {
    res.json(err).status(400).end();
  }
};
