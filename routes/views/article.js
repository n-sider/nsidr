const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    const query = {
      slug: req.params.slug
    };

    const article = keystone.list('NSiderArticle').model.findOne(query);

    article.populate('tags').exec((err, result) => {
      if (result) {
        locals.meta.title = `nsidr | ${result.title}`;
        locals.article = result;
        locals.currentPage = locals.article.pages.find(page => page.pageNumber === (Number(req.params.page) || 1));

        if (!locals.currentPage) {
          err = new Error('Article page not found');
        }
      } else {
        err = new Error('Article not found');
      }
      next(err);
    });
  });

  view.render((err) => {
    if (err) {
      return view.res.render('404', locals);
    }
    return view.res.render('article', locals);
  });
};
