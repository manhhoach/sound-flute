const Post = require('../models/Post');
const { mongooseToObject } = require('../../ulti/mongoose');

const del = require('./../../ulti/del')
const cloudinary = require('cloudinary');
var ObjectID = require('mongodb').ObjectID;
const getFileName = (filename) => {
  let i = filename.lastIndexOf('.');
  return filename.slice(0, i);
}
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})
const shareFacebook=require('share-facebook')


class PostsController {

  // GET /posts/:slug
  show(req, res, next) {
    Post.findOne({ slug: req.params.slug })
      .then(post => {

        var time = post.createdAt.toString();
        time = time.slice(0, 24);

        var tempPost = mongooseToObject(post);
        tempPost.time=time;

        let a={
          url:`${req.protocol}://${req.headers.host}${req.originalUrl}`, 
          title: tempPost.header,
          image: tempPost.image,
          url_fb: `https://www.facebook.com/sharer/sharer.php?u=${req.protocol}://${req.headers.host}${req.originalUrl}`,
          description: tempPost.header
        }
        res.render('posts/show', {
          post: tempPost,
          a,
          name: post.header
        });
      })
      .catch(e => next(e));
  }

  // GET /posts/create
  create(req, res, next) {
    res.render('posts/create', {name: 'Tạo bài viết'});
  }

  //POST /posts/upload image
  async upload(req, res, next) {
    try {
      let result = await cloudinary.v2.uploader.upload(req.files.upload.path, { public_id: getFileName(req.files.upload.name) })
      let msg = 'Upload successfully';
      let funcNum = req.query.CKEditorFuncNum;
      del(req.files.upload.path)
      res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + result.url + "','" + msg + "');</script>");
      // fs.readFile(req.files.upload.path, function (err, data) {
      //   var newPath = 'public/img-upload/' + req.files.upload.name;

      //   fs.writeFile(newPath, data,async function (err) {
      //     if (err)
      //       console.log({ err: err });
      //     else {
      //       // console.log(req.files.upload.originalFilename);
      //       let fileName = req.files.upload.name;
      //       let url = '/img-upload/' + fileName;
      //       let msg = 'Upload successfully';
      //       let funcNum = req.query.CKEditorFuncNum;
      //       pathImage.push(fileName);

      //       let result = await cloudinary.v2.uploader.upload(newPath, { public_id: getFileName(fileName) })
      //       del(newPath)
      //       res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + result.url + "','" + msg + "');</script>");
      //     }
      //   });
      // });

    } catch (error) {
      console.log(error.message);
    }
  }


  // POST /posts/store
  async store(req, res, next) {
    try {
      let post = {
        header: req.body.header,
        content: req.body.content
      }
      if (req.file) {
        let file = req.file;
        let filename = getFileName(file.filename)
        let result = await cloudinary.v2.uploader.upload(file.path, { public_id: filename })
        del(file.path)
        post.image = result.url;
      }

      await Post.create(post);
      res.redirect('/');
    }
    catch (err) {
      next(err);
    }
  }

  // GET /posts/:id/edit
  edit(req, res, next) {
    Post.findById(req.params.id)
      .then(post => {
        res.render('posts/edit', {
          post: mongooseToObject(post),
          name: 'Chỉnh sửa bài viết'
        });
      })
      .catch(e => next(e));
  }


  // PUT /posts/:id
  async update(req, res, next) {
    try {
      let post = {
        header: req.body.header,
        content: req.body.content,
      };
      if (req.file) {
        let file = req.file;
        let filename = getFileName(file.filename)
        let result = await cloudinary.v2.uploader.upload(file.path, { public_id: filename })
        del(file.path)
        post.image = result.url;
      }
      await Post.updateOne({ _id: ObjectID(req.params.id) }, post)
      res.redirect('/');
    }
    catch (err) {
      next(err);
    }
  }


  // DELETE /posts/:id/delete
  delete(req, res, next) {
    Post.findById(req.params.id)
      .then(post => {
        return Post.deleteOne({ _id: ObjectID(req.params.id) })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e));
  }


}

module.exports = new PostsController();