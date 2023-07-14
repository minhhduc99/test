const Mdl = require('../models/team_user');
const config = require('config');

const controllerName = 'teamUserController';

// Display list on get
exports.list_get = async function(req, res) {
  console.log(controllerName + ' - list - limit = %s', JSON.stringify(req.query.limit));
  var limit = req.query.limit;
  var offset = req.query.offset;
  // get all
  try {
    var c = await Mdl.count();
    var count = c['count(*)'];
    var params = {
      limit: limit,
      offset: offset
    };
    var r = await Mdl.getAll(params);
    var result = {
      count: count,
      data: r
    };
    res.send (JSON.stringify(result));
  } catch (err) {
    console.log(err);
    res.send (JSON.stringify(err));
  }
};


// Handle update status on POST.
exports.list_by_team_get = async function(req, res) {
  console.log(controllerName + ' - list_by_team_get - body = %s', JSON.stringify(req.query.teamId));
  var team_id = req.query.teamId;
  if(team_id) {
    try {
      var result = await Mdl.getByTeam({team_id: team_id});
      res.send (JSON.stringify(result));
    } catch (err) {
      res.json(err).status(400).end();
    }
  } else {
    res.json({error: 'teamId is required'}).status(400).end();
  }
};

// Handle create on POST.
exports.create_post = async function(req, res) {
  console.log(controllerName + ' - create_post - body = %s', JSON.stringify(req.body, null, 4));

  var item = {};
  for(var i=0; i<Mdl.columns.keys.length; i++) {
    item[Mdl.columns.keys[i]] = req.body[Mdl.columns.keys[i]];
  }
  try {
    var result = await Mdl.create(item);
    res.send (JSON.stringify(result));
  } catch (err) {
    res.json(err).status(400).end();
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

// Handle update status on POST.
exports.create_or_update_list_post = async function(req, res) {
  console.log(controllerName + ' - create_or_update_list_post - body = %s', JSON.stringify(req.body, null, 4));
  var list = req.body.list;
  var team_id = req.body.team_id;
  console.log(list);
  if(team_id && list) {
    try {
      await Mdl.deleteAllByTeam({team_id: team_id});
      var result = null;
      for(var i=0; i<list.length; i++) {
        result = await Mdl.create(list[i]);
      }
      res.send (JSON.stringify(result));
    } catch (err) {
      res.json(err).status(400).end();
    }
  } else {
    res.json({error: 'id and status are required'}).status(400).end();
  }
};
