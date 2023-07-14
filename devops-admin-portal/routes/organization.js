var checkRole = require('../middlewares/checkRole');
var attachCurrentUser = require('../middlewares/attachCurrentUser');
var isAuth = require('../middlewares/isAuth');

var express = require('express');
var router = express.Router();

var orgController = require('../controllers/organizationController');

/*
// POST request for creating
router.post('/create', isAuth, attachCurrentUser, checkRole(['sadmin']), orgController.create_post);

// POST request for updating
router.post('/update', isAuth, attachCurrentUser, checkRole(['sadmin']), orgController.update_post);

// POST request for updating status
router.post('/updateStatus', isAuth, attachCurrentUser, checkRole(['sadmin']), orgController.update_status_post);

// GET request for listing
router.get('/', isAuth, attachCurrentUser, checkRole(['sadmin']), orgController.list_get);
*/

// -------- FOR TESTING ONLY -----------
// removed authentication and authorization!
router.post('/create', isAuth, attachCurrentUser, orgController.create_post);

router.post('/update', isAuth, attachCurrentUser, orgController.update_post);

router.post('/updateStatus', isAuth, attachCurrentUser, orgController.update_status_post);

router.get('/', orgController.list_get);


module.exports = router;
