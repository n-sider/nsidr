const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    const query = {
      slug: req.params.slug
    };

    if (req.query.id) {
      query['_id'] = req.query.id;
    } else {
      query.publishedDate = { $lt: new Date() };
    }

    const post = keystone.list('Post').model.findOne(query);

    post.populate('authors tags').exec((err, result) => {
      if (result) {
        locals.meta.title = `nsidr | ${result.title}`;
        locals.post = result;
      } else {
        err = new Error('Post not found');
      }
      next(err);
    });
  });

  view.render((err) => {
    if (err) {
      return view.render('404', locals);
    }
    return view.render('post', locals);
  });
};
