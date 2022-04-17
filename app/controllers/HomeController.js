const Post = require('../models/Post');
const { multiMongooseToObject } = require('../../ulti/mongoose');

class HomeController {

  // [GET] 
  show(req, res, next) {
    let query = {};
    if (req.query.topic)
      query.topic = req.query.topic;

    Post.find(query).sort({ createdAt: 'desc'})
      .then(posts => {
        res.render('home', {
          posts: multiMongooseToObject(posts)
        });

      })
      .catch(e => next(e));
  }

}

module.exports = new HomeController();