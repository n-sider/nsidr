const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    const article = keystone.list('NSiderArticle').model.findOne()
      .where('slug').equals(req.params.slug)
      .where('isVisible').ne('recalled');

    article.populate('tags').exec((err, result) => {
      if (result) {
        locals.article = result;
        locals.currentPage = locals.article.pages.find(page => page.pageNumber === (Number(req.params.page) || 1));

        locals.meta.title = `nsidr / ${result.title}`;
        if (locals.currentPage.pageNumber > 1) {
          locals.meta.title += ` / page ${locals.currentPage.pageNumber}`;
        }

        locals.article.authors.sort((a, b) => {
          if (a.displayOrder < b.displayOrder) {
            return -1;
          } else if (a.displayOrder > b.displayOrder) {
            return 1;
          }
          return 0;
        });

        locals.pagination = {
          prev: locals.currentPage.pageNumber > 1 ?
            `/archive/${locals.article.slug}/${locals.currentPage.pageNumber - 1}` : undefined,
          current: locals.currentPage.pageNumber,
          total: locals.article.pages.length,
          next: (locals.article.pages.length - locals.currentPage.pageNumber) > 0 ?
            `/archive/${locals.article.slug}/${locals.currentPage.pageNumber + 1}` : undefined
        };

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
    locals.layoutClass = 'article-view';
    locals.fullViewport = true;
    return view.res.render('article', locals);
  });
};
