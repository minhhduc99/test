var checkRole = require('../middlewares/checkRole');
var attachCurrentUser = require('../middlewares/attachCurrentUser');
var isAuth = require('../middlewares/isAuth');

var express = require('express');
var router = express.Router();

var controller = require('../controllers/projectUserController');

/*
// POST request for creating
router.post('/create', isAuth, attachCurrentUser, checkRole(['admin']), controller.create_post);

// POST request for updating
router.post('/update', isAuth, attachCurrentUser, checkRole(['admin']), controller.update_post);

// POST request for updating status
router.post('/updateStatus', isAuth, attachCurrentUser, checkRole(['admin']), controller.update_status_post);

// POST request for create or update status of array of items
router.post('/createOrUpdateList', isAuth, attachCurrentUser, checkRole(['admin']), controller.create_or_update_list_post);

// GET request for listing
router.get('/', isAuth, attachCurrentUser, checkRole(['admin']), controller.list_get);
*/

// -------- FOR TESTING ONLY -----------
// removed authentication and authorization!
router.post('/create', isAuth, attachCurrentUser, controller.create_post);

router.post('/update', isAuth, attachCurrentUser, controller.update_post);

router.post('/updateStatus', isAuth, attachCurrentUser, controller.update_status_post);

router.post('/createOrUpdateList', isAuth, attachCurrentUser, controller.create_or_update_list_post);

router.get('/listByProject', isAuth, attachCurrentUser, controller.list_by_project_get);

router.get('/listByUser', isAuth, attachCurrentUser, controller.list_by_user_get);

router.get('/', isAuth, attachCurrentUser, controller.list_get);


module.exports = router;
