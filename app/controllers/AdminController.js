const Post = require('../models/Post');
const { multiMongooseToObject } = require('../../ulti/mongoose');

class AdminController {

    // [GET] admin/posts/stored
    storedPosts(req, res, next) {

        Post.find({}).sort('-createdAt')
            .then(posts => {
                res.render('admin/stored-posts', {
                    posts: multiMongooseToObject(posts),
                    name:'Quản lý bài viết'
                })
            })
            .catch(error => next(error))
    }


}

module.exports = new AdminController();