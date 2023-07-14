module.exports = (requiredRoles) => {
  return (req, res, next) => {
    // console.log('Required role?');
    // console.log(requiredRoles);
    if(requiredRoles) {
      for(var i=0; i<requiredRoles.length; i++) {
        if(req.currentUser.role == requiredRoles[i]) {
          // console.log('User meet required role, going to next middleware')
          return next();
        }
      }
    }
    return res.status(401).end();
  }
}
