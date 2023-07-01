const express = require('express');
const router = express.Router();
const postsController = require('../app/controllers/PostsController');
const isAuth = require('../middleware/isAuth')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const isLogin = require('../middleware/isLogin');
const new_upload = require('./../middleware/upload')


router.get('/create', isAuth, isLogin, postsController.create);

router.get('/:id/edit', isLogin, postsController.edit);

router.post('/upload', multipartMiddleware, postsController.upload);

router.post('/store', isAuth, new_upload.single('image'), postsController.store);


router.delete('/:id', isAuth, postsController.delete);

router.patch('/update/:id', isAuth, new_upload.single('image'), postsController.update);

router.get('/:slug', isLogin, postsController.show);


module.exports = router;