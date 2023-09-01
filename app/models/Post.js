const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const PostSchema = new Schema({
  header: { type: String, required: true },
  content: { type: String, required: true },
  topic: { type: String },
  isBreakNews: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  image: { type: String },
  slug: { type: String, slug: 'header', unique: true }
}, { timestamps: true });



module.exports = mongoose.model('Post', PostSchema);


