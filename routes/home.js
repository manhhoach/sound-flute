const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const isLogin = require('../middleware/isLogin');

router.get('/', isLogin, homeController.show);

module.exports = router;