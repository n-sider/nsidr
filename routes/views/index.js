const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    locals.year = new Date().getFullYear();

    const post = keystone.list('Post').model.find()
      .where('publishedDate').lt(new Date())
      .sort('-publishedDate')
      .limit(5);

    post.populate('authors tags').exec((err, result) => {
      if (result) {
        [locals.leadingPost, ...locals.posts] = result;
        locals.hasFeaturedPost = locals.leadingPost.featured;
      } else {
        err = new Error('Posts not found');
      }
      next(err);
    });
  });

  view.render((err) => {
    if (err) {
      return view.res.render('404', locals);
    }
    locals.scripts = [
      '/scripts/index.js'
    ];
    return view.res.render('index', locals);
  });
};
