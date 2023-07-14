
var isAuth = require('../middlewares/isClientAuth');

var express = require('express');
var router = express.Router();

var client_user_controller = require('../controllers/clientUserController');

router.get('/:id', isAuth, client_user_controller.user_detail);

router.get('/', isAuth, client_user_controller.user_list_get);

module.exports = router;
