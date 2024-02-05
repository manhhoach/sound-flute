const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  header: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String }
}, { timestamps: true });



module.exports = mongoose.model('Post', PostSchema);


