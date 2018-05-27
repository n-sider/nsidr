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
        locals.meta.title = `nsidr / ${result.title}`;
        locals.post = result;
      } else {
        err = new Error('Post not found');
      }
      next(err);
    });
  });

  view.on('init', (next) => {
    const posts = keystone.list('Post').model.find()
      .where('publishedDate').lt(new Date())
      .where('_id').ne(locals.post['_id'])
      .sort('-publishedDate')
      .limit(3);

    posts.populate('authors').exec((err, result) => {
      if (result) {
        locals.posts = result;
      } else {
        err = new Error('Posts not found');
      }
      next(err);
    });
  });

  view.render((err) => {
    if (err) {
      locals.layoutClass = 'not-found';
      return view.res.render('404', locals);
    }
    locals.layoutClass = 'content-view';
    return view.res.render('post', locals);
  });
};
