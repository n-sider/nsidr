const keystone = require('keystone');

const Tag = keystone.list('Tag');

exports.get = (req, res) => {
  Tag.model.find().select('name').exec((err, items) => {
    if (err) {
      return res.json({ err: err });
    }
    res.json(items);
  });
};
