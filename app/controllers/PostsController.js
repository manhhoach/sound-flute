const Post = require('../models/Post');
const { mongooseToObject } = require('../../ulti/mongoose');
const formatText = require('./../../ulti/formatText')
const { getFileName } = require('./../../ulti/getFileName')
const cloudinary = require('cloudinary');
var ObjectID = require('mongodb').ObjectID;
let streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img_stream = cloudinary.v2.uploader.upload_stream({
      public_id: `${Date.now()}-${getFileName(file.originalname)}`
    }, function (error, result) {
      if (error) {
        reject(new AppError(400, error))
      }
      else {
        resolve(result.url)
      }
    })
    streamifier.createReadStream(file.buffer).pipe(img_stream)
  })

}


class PostsController {

  show(req, res, next) {
    Post.findById(req.params._id)
      .then(post => {
        let isoDate = post.createdAt;
        let tempPost = mongooseToObject(post);
        const formattedDate = `${isoDate.getDate()}/${isoDate.getMonth() + 1}/${isoDate.getFullYear()}`;
        const formattedTime = `${isoDate.getHours()}:${isoDate.getMinutes()}:${isoDate.getSeconds()}`;

        const result = `${formattedDate}, ${formattedTime}`;
        tempPost.time = result;

        let chord = {
          url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
          title: tempPost.header,
          image: tempPost.image,
          url_fb: `https://www.facebook.com/sharer/sharer.php?u=${req.protocol}://${req.headers.host}${req.originalUrl}`,
          description: tempPost.header,
          titleForMat: formatText(tempPost.header)
        }
        res.render('posts/show', {
          chord: chord,
          post: tempPost
        });
      })
      .catch(e => next(e));
  }


  create(req, res, next) {
    res.render('posts/create', { chord: { title: 'Tạo bài viết' } });
  }


  async upload(req, res, next) {
    try {
      let result = await cloudinary.v2.uploader.upload(req.files.upload.path, { public_id: getFileName(req.files.upload.name) })
      let msg = 'Upload successfully';
      let funcNum = req.query.CKEditorFuncNum;
      del(req.files.upload.path)
      res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + result.url + "','" + msg + "');</script>");

    } catch (error) {
      console.log(error.message);
    }
  }


  async store(req, res, next) {
    try {
      let post = {
        header: req.body.header,
        content: req.body.content
      }
      if (req.file) {
        let url = await uploadImage(req.file)
        post.image = url;
      }

      await Post.create(post);
      res.redirect('/');
    }
    catch (err) {
      next(err);
    }
  }

  edit(req, res, next) {
    Post.findById(req.params._id)
      .then(post => {
        res.render('posts/edit', {
          post: mongooseToObject(post),
          chord: { title: 'Chỉnh sửa bài viết' }
        });
      })
      .catch(e => next(e));
  }


  async update(req, res, next) {
    try {
      let post = {
        header: req.body.header,
        content: req.body.content,
      };
      if (req.file) {
        let url = await uploadImage(req.file)
        post.image = url;
      }
      await Post.updateOne({ _id: ObjectID(req.params._id) }, post)
      res.redirect('/');
    }
    catch (err) {
      next(err);
    }
  }


  delete(req, res, next) {
    Post.findById(req.params._id)
      .then(post => {
        return Post.deleteOne({ _id: ObjectID(req.params._id) })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e));
  }


}

module.exports = new PostsController();