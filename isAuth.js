var jwt = require('express-jwt');
const KeycloakTokenVerify = require('../helpers/keycloakTokenVerify');
var UserModel = require('../models/user');



const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
}

const middleware = async function (req, res, next) {
  let token = getTokenFromHeader(req);
  //console.log(token);

  // try to verify token using keycloak key
  let decryptedToken = await KeycloakTokenVerify.verifyKeycloakToken(token);
  if(decryptedToken) {    
    req.token = decryptedToken;
    req.token.data = {
      account: decryptedToken.preferred_username
    }
    next();
    return;        
  }
  
  // it can be DAP token
  return jwt({
    secret: process.env.JWT_SECRET, //Config.get('jwt_secret'),
    userProperty: 'token', // this is where the next middleware can find the encoded data generated in services/auth:generateToken
    getToken: getTokenFromHeader,
  })(req, res, next);
}

module.exports = middleware;
