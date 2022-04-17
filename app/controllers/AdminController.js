const Post = require('../models/Post');
const { multiMongooseToObject } = require('../../ulti/mongoose');

class AdminController {

    // [GET] admin/posts/stored
    storedPosts(req, res, next) {

        Post.find({})
            .then(posts => {
                posts.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
                res.render('admin/stored-posts', {
                    posts: multiMongooseToObject(posts)
                })
            })
            .catch(error => next(error))
    }


}

module.exports = new AdminController();