const keystone = require('keystone');
const mongoose = require('mongoose');

const Post = keystone.list('Post');
const Reaction = keystone.list('Reaction');

exports.post = (req, res) => {
  if (req.body && req.body.slug) {
    Post.model.findOne().where('slug', req.body.slug).exec((err, post) => {
      if (post) {
        const newReaction = new Reaction.model({
          type: req.body.reaction
        });
        newReaction.save(() => {
          if (Array.isArray(post.reactions)) {
            post.reactions.push(newReaction);
          } else {
            post.reactions = [newReaction];
          }
          post.save();
          res.json({
            slug: req.body.slug,
            reactionId: newReaction['_id']
          });
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  if (req.params.slug && req.params.id) {
    Reaction.model.findById(req.params.id, (err, reaction) => {
      if (reaction) {
        reaction.remove(() => {
          Post.model.update(
            { slug: req.params.slug },
            { $pull: { reactions: new mongoose.Types.ObjectId(req.params.id) } },
            (delErr) => {
              if (!delErr) {
                res.json({ deleted: req.params.id });
              }
            }
          );
        });
      }
    });
  }
};
