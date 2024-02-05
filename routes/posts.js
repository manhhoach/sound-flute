const express = require('express');
const router = express.Router();
const postsController = require('../app/controllers/PostsController');
const isAuth = require('../middleware/isAuth')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const isLogin = require('../middleware/isLogin');
const new_upload = require('./../middleware/upload')


router.get('/create', isAuth, isLogin, postsController.create);

router.get('/:_id/edit', isLogin, postsController.edit);

router.post('/upload', multipartMiddleware, postsController.upload);

router.post('/store', isAuth, new_upload.single('image'), postsController.store);


router.delete('/:_id', isAuth, postsController.delete);

router.patch('/update/:_id', isAuth, new_upload.single('image'), postsController.update);

router.get('/:_id', isLogin, postsController.show);


module.exports = router;