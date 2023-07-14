var checkRole = require('../middlewares/checkRole');
var attachCurrentUser = require('../middlewares/attachCurrentUser');
var isAuth = require('../middlewares/isAuth');

var express = require('express');
var router = express.Router();

var controller = require('../controllers/teamController');

/*
// POST request for creating
router.post('/create', isAuth, attachCurrentUser, checkRole(['sadmin']), controller.create_post);

// POST request for updating
router.post('/update', isAuth, attachCurrentUser, checkRole(['sadmin']), controller.update_post);

// POST request for updating status
router.post('/updateStatus', isAuth, attachCurrentUser, checkRole(['sadmin']), controller.update_status_post);

// GET request for listing
router.get('/', isAuth, attachCurrentUser, checkRole(['sadmin']), controller.list_get);
*/

// -------- FOR TESTING ONLY -----------
// removed authentication and authorization!
router.post('/create', isAuth, attachCurrentUser, controller.create_post);

router.post('/update', isAuth, attachCurrentUser, controller.update_post);

router.post('/updateStatus', isAuth, attachCurrentUser, controller.update_status_post);

router.get('/', isAuth, attachCurrentUser, controller.list_get);


module.exports = router;
