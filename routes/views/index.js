const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    locals.year = new Date().getFullYear();

    const posts = keystone.list('Post').model.find()
      .where('publishedDate').lt(new Date())
      .sort('-publishedDate')
      .limit(4);

    posts.populate('authors reactions').exec((err, result) => {
      if (result) {
        if (result[0].featured) {
          [locals.leadingPost, ...locals.posts] = result;
          locals.hasFeaturedPost = true;
        } else {
          locals.posts = result;
          locals.hasFeaturedPost = false;
        }
      } else {
        err = new Error('Posts not found');
      }
      next(err);
    });
  });

  view.render((err) => {
    if (err) {
      return view.res.render('404', {
        meta: {
          title: 'nsidr / 404'
        },
        layoutClass: 'not-found-view'
      });
    }
    locals.scripts = [
      '/scripts/index.js'
    ];
    return view.res.render('index', locals);
  });
};
