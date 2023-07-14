var User = require('../models/user');
var argon2 = require('argon2');
var {randomBytes} = require('crypto');
var jwt = require('jsonwebtoken');
const config = require('config');
var cipAuthen = require('../helpers/cipAuthen');
var ssoAuthen = require('../helpers/ssoAuthen');

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
    res.send (JSON.stringify(result));
  } catch (err) {
    console.log(err);
    res.send (JSON.stringify(err));
  }
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
  console.log('usersController - get - id = %s', req.params.id);
  User.getWithId(req.params.id).then((result) => {res.send (JSON.stringify(result))},
    (err) => {res.send (JSON.stringify(err))});
};

// Display user create form on GET.
exports.user_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: user create GET');
};


function generateJWT(user) {
  return jwt.sign({
    data: {
      id: user.id,
      name: user.name,
      account: user.account,
      role: user.role
    }
  }, process.env.JWT_SECRET, { expiresIn: '48h' }); // config.get('jwt_secret'), { expiresIn: '48h' });
}
/*
  user status:
  0: active
  1: disabled
*/

// Handle user create on POST.
exports.user_create_post = async function(req, res) {
  console.log('usersController - user_create_post - body = %s', JSON.stringify(req.body, null, 4));

  var user = {};
  user.name = req.body.name;
  user.account = req.body.account;
  user.owner_id = req.body.owner_id;
  user.role = req.body.role;
  user.status = req.body.status;
  user.description = req.body.description;
  var password = req.body.password;
  const salt = randomBytes(32);
  var passwordHashed = await argon2.hash(password, { salt });
  user.password = passwordHashed;
  user.salt = salt.toString('hex');
  console.log(user);
  try {
    var result = await User.create(user);
    console.log(result.lastID);
    var userRecord = await User.getWithId(result.lastID);
    console.log(userRecord);
    const token = generateJWT(userRecord);
    res.send (JSON.stringify({
      id: userRecord.id,
      name: userRecord.name,
      account: userRecord.account,
      description: userRecord.description,
      owner_id: userRecord.owner_id,
      role: userRecord.role,
      status: userRecord.status,
      token,
    }));
  } catch (err) {
    if(err && err.errno == 19) {
      res.json({
        result: 'error',
        message: 'Check MysingleId (may be existed)!'
      }).status(400).end();
    } else {
      res.json({
        result: 'error',
        message: err
      }).status(400).end();
    }
  }
};

// Handle user create on POST.
exports.user_create_with_cip_account_post = async function(req, res) {
  //console.log('usersController - user_create_post - body = %s', JSON.stringify(req.body, null, 4));
  var user = {};
  user.name = req.body.name;
  user.account = req.body.account;
  user.owner_id = req.body.owner_id;
  user.role = 'user';
  user.status = 'active';
  user.description = req.body.description;
  var password = req.body.password;
  const salt = randomBytes(32);
  var passwordHashed = await argon2.hash(password, { salt });
  user.password = passwordHashed;
  user.salt = salt.toString('hex');
  console.log(user);
  cipAuthen.cip_authen({userName:user.account, password: req.body.password})
  .then(async function (parsedBody) {
    console.log(parsedBody);
    try {
      var result = await User.create(user);
      console.log(result.lastID);
      var userRecord = await User.getWithId(result.lastID);
      console.log(userRecord);
      const token = generateJWT(userRecord);
      res.send (JSON.stringify({
        id: userRecord.id,
        name: userRecord.name,
        account: userRecord.account,
        description: userRecord.description,
        owner_id: userRecord.owner_id,
        role: userRecord.role,
        status: userRecord.status,
        token,
      }));
    } catch (err) {
      if(err && err.errno == 19) {
        res.json({
          result: 'error',
          message: 'Check MysingleId (may be existed)!'
        }).status(400).end();
      } else {
        res.json({
          result: 'error',
          message: err
        }).status(400).end();
      }
    }
  }).catch(function (err) {
    console.log(err);
    res.status(403).send(JSON.stringify({
      result: 'error', message: "Invalid account or password"
    })).end();
  });
};

// Handle user create on POST.
exports.user_create_with_sso_account_post = async function(req, res) {
  //console.log('usersController - user_create_post - body = %s', JSON.stringify(req.body, null, 4));
  let email = req.body.email;
  let token = req.body.token;
  var user = {};
  user.name = req.body.name;
  user.account = req.body.account;
  user.owner_id = req.body.owner_id;
  user.role = 'user';
  user.status = 'active';
  user.description = req.body.description;
  const salt = randomBytes(32);
  user.password = 'password_is_not_supported';
  user.salt = salt.toString('hex');
  console.log(user);
  ssoAuthen.sso_authen(token)
  .then(async function (parsedBody) {
    console.log(parsedBody);
    //TODO: verify username or email
    try {
      var result = await User.create(user);
      console.log(result.lastID);
      var userRecord = await User.getWithId(result.lastID);
      console.log(userRecord);
      const token = generateJWT(userRecord);
      res.send (JSON.stringify({
        id: userRecord.id,
        name: userRecord.name,
        account: userRecord.account,
        description: userRecord.description,
        owner_id: userRecord.owner_id,
        role: userRecord.role,
        status: userRecord.status,
        token,
      }));
    } catch (err) {
      if(err && err.errno == 19) {
        res.json({
          result: 'error',
          message: 'Check MysingleId (may be existed)!'
        }).status(400).end();
      } else {
        res.json({
          result: 'error',
          message: err
        }).status(400).end();
      }
    }
  }).catch(function (err) {
    console.log(err);
    res.status(403).send(JSON.stringify({
      result: 'error', message: "Invalid account or password"
    })).end();
  });
};

// Handle user create on POST.
exports.user_login_post = async function(req, res) {
  //console.log('usersController - user_login_post - body = %s', JSON.stringify(req.body, null, 4));
  var account = req.body.account;
  var password = req.body.password;
  try {
    const userRecord = await User.getWithAccount(account);
    console.log(userRecord);
    if (userRecord && userRecord.status == 'active') {
      const correctPassword = await argon2.verify(userRecord.password, password);
      if (correctPassword) {
        const token = generateJWT(userRecord);
        res.send (JSON.stringify({
          id: userRecord.id,
          name: userRecord.name,
          account: userRecord.account,
          description: userRecord.description,
          owner_id: userRecord.owner_id,
          role: userRecord.role,
          status: userRecord.status,
          token,
        }));
        return;
      }
    }
  } catch (e) {}
  res.status(403).send(JSON.stringify({message: "Invalid username or password"})).end();
};

// Handle user create on POST.
exports.user_login_post_sso = async function(req, res) {
  //console.log('usersController - user_login_post - body = %s', JSON.stringify(req.body, null, 4));
  var account = req.body.account;
  var ssoToken = req.body.token;
  try {
    ssoAuthen.sso_authen(ssoToken)
    .then(async function (parsedBody) {
      const userRecord = await User.getWithAccount(account);
      console.log(userRecord);
      if (userRecord && userRecord.status == 'active') {
      //TODO: validate user with SSO provider
        const token = generateJWT(userRecord);
        res.send (JSON.stringify({
          id: userRecord.id,
          name: userRecord.name,
          account: userRecord.account,
          description: userRecord.description,
          owner_id: userRecord.owner_id,
          role: userRecord.role,
          status: userRecord.status,
          token,
        }));
        return;
      } else {
        res.status(403).send(JSON.stringify({message: "Invalid username or token"})).end();
      }
    }, error => {
      res.status(403).send(JSON.stringify({message: "Invalid username or token"})).end();
    });
  } catch (e) {
    console.log(e);
    res.status(403).send(JSON.stringify({message: "Invalid username or token"})).end();
  }
};


// Display user delete form on GET.
exports.user_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: user delete GET');
};

exports.user_delete_all_get = function(req, res) {
  console.log('usersController - user_delete_all_get - body = %s', JSON.stringify(req.body, null, 4));
  User.deleteAll().then((result) => {res.send (JSON.stringify(result))},
    (err) => {res.send (JSON.stringify(err))});
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: user delete POST');
};

// Display user update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: user update GET');
};

// Handle user update on POST.
exports.user_update_post = async function(req, res) {
  //console.log('usersController - user_update_post - body = %s', JSON.stringify(req.body, null, 4));
  var account = req.body.account;
  try {
    const userRecord = await User.getWithAccount(account);
    if (userRecord) {
      userRecord.name = req.body.name;
      userRecord.account = req.body.account;
      userRecord.role = req.body.role;
      userRecord.owner_id = req.body.owner_id;
      userRecord.description = req.body.description;
      userRecord.status = req.body.status;
      var password = req.body.password;
      if(password) {
        // new password is set
        const salt = randomBytes(32);
        var passwordHashed = await argon2.hash(password, { salt });
        userRecord.password = passwordHashed;
        userRecord.salt = salt.toString('hex');
      }
      var result = await User.update(userRecord);
      console.log(result);
      const token = generateJWT(userRecord);
      res.send (JSON.stringify({
        id: userRecord.id,
        name: userRecord.name,
        account: userRecord.account,
        description: userRecord.description,
        owner_id: userRecord.owner_id,
        role: userRecord.role,
        status: userRecord.status,
        token,
      }));
      return;
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(400).end();
    return;
  }
  res.status(400).end();

};

// Handle user change password on POST. {account, password, newPassword}
exports.user_update_password_post = async function(req, res) {
  //console.log('usersController - user_update_password_post - body = %s', JSON.stringify(req.body, null, 4));
  var account = req.body.account;
  var password = req.body.password;
  try {
    const userRecord = await User.getWithAccount(account);
    if (userRecord) {
      const correctPassword = await argon2.verify(userRecord.password, password);
      if (correctPassword) {
        var newPassword = req.body.newPassword;
        if(newPassword) {
          // new password is set
          const salt = randomBytes(32);
          var passwordHashed = await argon2.hash(newPassword, { salt });
          userRecord.password = passwordHashed;
          userRecord.salt = salt.toString('hex');
        }
        var result = await User.update(userRecord);
        console.log(result);
        const token = generateJWT(userRecord);
        res.send (JSON.stringify({
          id: userRecord.id,
          name: userRecord.name,
          account: userRecord.account,
          description: userRecord.description,
          owner_id: userRecord.owner_id,
          role: userRecord.role,
          status: userRecord.status,
          token,
        }));
        return;
      }
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(400).end();
    return;
  }
  res.status(400).end();

};


// Handle user update on POST.
exports.user_update_self_post = async function(req, res) {
  //console.log('usersController - user_update_self_post - body = %s', JSON.stringify(req.body, null, 4));
  var account = req.body.account;
  try {
    const userRecord = await User.getWithAccount(account);
    if (userRecord) {
      userRecord.name = req.body.name;
      userRecord.description = req.body.description;
      var password = req.body.password;
      if(password) {
        // new password is set
        const salt = randomBytes(32);
        var passwordHashed = await argon2.hash(password, { salt });
        userRecord.password = passwordHashed;
        userRecord.salt = salt.toString('hex');
      }
      console.log(userRecord);
      var result = await User.update(userRecord);
      console.log(result);
      const token = generateJWT(userRecord);

      res.send (JSON.stringify({
        id: userRecord.id,
        name: userRecord.name,
        account: userRecord.account,
        description: userRecord.description,
        owner_id: userRecord.owner_id,
        role: userRecord.role,
        status: userRecord.status,
        token,
      }));
      return;
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(400).end();
    return;
  }
  res.status(400).end();
};
