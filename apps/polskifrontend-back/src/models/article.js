import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  title: String,
  href: String,
  description: String,
  summary: String,
  date: Date,
  _blog: { type: String, ref: 'blog' }
});

ArticleSchema.options.toJSON = ArticleSchema.options.toJSON || {};
ArticleSchema.options.toJSON.transform = (doc, ret) => {
  return ret;
};

const Article = mongoose.model('article', ArticleSchema);

export default Article;
