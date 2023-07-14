var User = require('../models/user');
const config = require('config');
const util = require('../util/Util')

// Display list of all users.
exports.user_list_get = async function(req, res) {
  console.log('usersController - user_list - limit = %s', JSON.stringify(req.query.limit));
  try {
    var c = await User.count();
    var count = c['count(*)'];
    var params = {
      limit: req.query.limit,
      offset: req.query.offset,
      organization: req.query.organization
    };
    var r = await User.getAll(params);
    var result = {
      count: count,
      data: r
    };
    let encrypted = util.encrypt(JSON.stringify(result), req.app.key);
    res.send (encrypted);
    //console.log(util.decrypt(encrypted, req.app.key));
  } catch (err) {
    console.log(err);
    res.send (JSON.stringify(err));
  }
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
  console.log('usersController - get - id = %s', req.params.id);
  User.getWithId(req.params.id).then((result) => {
    let encrypted = util.encrypt(JSON.stringify(result), req.app.key);
    res.send (encrypted);
    //console.log(util.decrypt(encrypted, req.app.key));
  }, (err) => {
    res.send (JSON.stringify(err))
  });
};
