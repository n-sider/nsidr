const keystone = require('keystone');

const Post = keystone.list('Post');

exports.getReactions = (req, res) => {
  if (req.params.slug) {
    Post.model.findOne().where('slug', req.params.slug).populate('reactions').exec((err, post) => {
      if (err) {
        return res.json({ err: err });
      }
      res.json(post.reactionSummary);
    });
  }
};
