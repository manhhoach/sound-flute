const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const isAuth = require('../middleware/isAuth');
const isLogin = require('../middleware/isLogin');

router.get('/posts/stored', isAuth, isLogin, adminController.storedPosts);


module.exports = router;