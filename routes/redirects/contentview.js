const keystone = require('keystone');

const render404 = res => res.render('404', {
  meta: {
    title: 'nsidr / 404'
  },
  layoutClass: 'not-found-view'
});

module.exports = (req, res) => {
  const { query } = req;

  if (query.contentid) {
    let articleURL = '/archive/';

    keystone.list('NSiderArticle').model.findOne()
      .select('slug')
      .where('legacyId').equals(query.contentid)
      .where('isVisible').ne('recalled')
      .exec((err, result) => {
        if (err || !result) {
          return render404(res);
        }
        articleURL += result.slug;
        if (query.page) {
          articleURL += `/${query.page}`;
        }
        res.status(301).redirect(articleURL);
      });
  } else {
    return render404(res);
  }
};
