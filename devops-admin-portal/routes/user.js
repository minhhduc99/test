var checkRole = require('../middlewares/checkRole');
var attachCurrentUser = require('../middlewares/attachCurrentUser');
var isAuth = require('../middlewares/isAuth');

var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

// POST request for creating user.
router.post('/create', isAuth, attachCurrentUser, user_controller.user_create_post);

// POST request for signup.
//router.post('/signup', user_controller.user_create_post);
router.post('/registerWithCIPAccount', user_controller.user_create_with_cip_account_post);

//router.post('/signup', user_controller.user_create_post);
router.post('/registerWithSSOAccount', user_controller.user_create_with_sso_account_post);


// POST request for login.
router.post('/login', user_controller.user_login_post);

// POST request for login.
router.post('/login-sso', user_controller.user_login_post_sso);

// POST request for changing password. {account, password, newPassword}
router.post('/change-password', isAuth, attachCurrentUser, user_controller.user_update_password_post);

// POST request for update user.
//router.post('/update', isAuth, attachCurrentUser,checkRole(['admin']), user_controller.user_update_post);
router.post('/update', isAuth, attachCurrentUser, user_controller.user_update_post);

router.post('/update-self', isAuth, attachCurrentUser, user_controller.user_update_self_post);

//router.get('/', isAuth, attachCurrentUser,checkRole(['admin']), user_controller.user_list_get);

router.get('/', isAuth, attachCurrentUser, user_controller.user_list_get);

module.exports = router;
