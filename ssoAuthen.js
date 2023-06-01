var rp = require('request-promise');
const config = require('config');
const kcConfig = config.get('keycloak');

exports.sso_authen = function(token) {
  var serverUrl = process.env.KEYCLOAK_URL;
  var realm = process.env.KEYCLOAK_REALM;
  if(!serverUrl) {
    serverUrl = kcConfig.serverUrl;
  }
  if(!realm) {
    realm = kcConfig.realm;
  }

  let url = serverUrl + '/auth/realms/' + realm + '/protocol/openid-connect/userinfo';
  let options = {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token},
    url: url,
    json: true,
    insecure: true,
    rejectUnauthorized: false
  };
  return rp(options);
};
