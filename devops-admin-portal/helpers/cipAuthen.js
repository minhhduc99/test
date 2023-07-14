var request = require('request');
var rp = require('request-promise');
const config = require('config');

// Display list of all items.
exports.cip_authen = function(req) {
  //console.log('cipAuthen - cip_authen - req = %s', JSON.stringify(req));
  var url = process.env.CIP_AUTHEN_URL;
  var appName = process.env.CIP_AUTHEN_APPNAME;
  if(!url) {
    url = config.get('cip_authen_url');
  }
  if(!appName) {
    appName = config.get('cip_authen_appName');
  }
  var userName = req.userName;
  var password = req.password;
  var options = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    url: url,
    body: {
      projectName: appName,
      username: userName,
      password: password
    },
    json: true
  };
  return rp(options);
};
