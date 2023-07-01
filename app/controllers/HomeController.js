const Post = require('../models/Post');
const { multiMongooseToObject } = require('../../ulti/mongoose');

class HomeController {

  // [GET] 
  show(req, res, next) {
    Post.find().sort({ createdAt: 'desc'})
      .then(posts => {
        let names='';
        posts.forEach(post => names+=`${post.header} `);
        res.render('home', {
          posts: multiMongooseToObject(posts),
          chord:{
            title: 'Cảm âm sáo trúc',
            description: names,
            url:`${req.protocol}://${req.headers.host}${req.originalUrl}`, 

          }
        });

      })
      .catch(e => next(e));
  }

}

module.exports = new HomeController();