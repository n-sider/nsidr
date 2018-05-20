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

        locals.article.authors.sort((a, b) => {
          if (a.displayOrder < b.displayOrder) {
            return -1;
          } else if (a.displayOrder > b.displayOrder) {
            return 1;
          }
          return 0;
        });

        locals.viewStyles = locals.article.style;

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
      locals.layoutClass = 'not-found';
      return view.res.render('404', locals);
    }
    locals.layoutClass = 'content-view';
    return view.res.render('article', locals);
  });
};
