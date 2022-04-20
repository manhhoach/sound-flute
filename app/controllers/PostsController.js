const Post = require('../models/Post');
const { mongooseToObject } = require('../../ulti/mongoose');
const fs = require('fs');
const filterPath = require('../../ulti/filterPath')
const deleteFile = require('../../ulti/deleteFile')
const del = require('./../../ulti/del')
const share = require('./../../ulti/shareFb');
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
let pathImage = [];

class PostsController {

  // GET /posts/:slug
  show(req, res, next) {
    Post.findOne({ slug: req.params.slug })
      .then(post => {

        var time = post.createdAt.toString();
        time = time.slice(0, 24);

        var tempPost = {
          header: post.header,
          timeCreated: time,
          content: post.content
        }
        let redirectUri = `https://${req.headers.host}${req.originalUrl}`;
        let a = share(redirectUri, redirectUri, '297026615602914');
        res.render('posts/show', {
          post: tempPost,
          a
        });
      })
      .catch(e => next(e));
  }

  // GET /posts/create
  create(req, res, next) {
    res.render('posts/create');
  }

  //POST /posts/upload image
  upload(req, res, next) {
    try {
      fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = 'public/img-upload/' + req.files.upload.name;

        fs.writeFile(newPath, data, function (err) {
          if (err)
            console.log({ err: err });
          else {
            // console.log(req.files.upload.originalFilename);
            let fileName = req.files.upload.name;
            let url = '/img-upload/' + fileName;
            let msg = 'Upload successfully';
            let funcNum = req.query.CKEditorFuncNum;
            pathImage.push(fileName);
            res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
          }
        });
      });

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
        post.image = `${result.url}`;
      }

      if (pathImage.length !== 0) {
        let path_url = await Promise.all(
          pathImage.map(async (ele) => {
            let result = await cloudinary.v2.uploader.upload(`public/img-upload/${ele}`, { public_id: getFileName(ele) })
            del(`public/img-upload/${ele}`)
            return result.url;
          })
        )  
        let arrayPath = filterPath(post.content);
        for(let i=0;i<arrayPath.length;i++)
        {
          post.content=post.content.replace(arrayPath[i], path_url[i]);
        }
        pathImage = [];
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
          post: mongooseToObject(post)
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
        post.image = `${result.url}`;
      }
      if (pathImage.length !== 0) {
        let path_url = await Promise.all(
          pathImage.map(async (ele) => {
            let result = await cloudinary.v2.uploader.upload(`public/img-upload/${ele}`, { public_id: getFileName(ele) })
            del(`public/img-upload/${ele}`)
            return result.url;
          })
        )  
        let arrayPath = filterPath(post.content);
        for(let i=0;i<arrayPath.length;i++)
        {
          post.content=post.content.replace(arrayPath[i], path_url[i]);
        }
        pathImage = [];
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
   // var arrayPath = [];
    Post.findById(req.params.id)
      .then(post => {
        // arrayPath = filterPath(post.content);
        // arrayPath.push(post.image);
        // deleteFile(arrayPath);
        return Post.deleteOne({ _id: ObjectID(req.params.id) })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e));
  }


}

module.exports = new PostsController();