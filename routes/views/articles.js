const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;
  const { query: params } = req;
  const perPage = 20;
  locals.filters = [];

  view.on('init', (next) => {
    if (params.tags) {
      locals.currentTag = params.tags;
      keystone.list('NSiderTag').model
        .findOne({ name: params.tags })
        .exec((err, result) => {
          if (err || !result) {
            locals.badFilter = true;
          } else {
            locals.filters.push({ field: 'tags', id: result['_id'], value: params.tags });
          }
          next();
        });
    } else {
      next();
    }
  });

  view.on('init', (next) => {
    const page = Number(params.page || 1);
    let filterQuerystring = '';

    locals.meta.title = 'nsidr / archive';
    if (params.tags) {
      locals.meta.title += ` / ${params.tags}`;
    }
    if (page > 1) {
      locals.meta.title += ` / page ${page}`;
    }
    locals.meta.og.title = 'nsidr / archive';
    locals.meta.og.type = 'website';
    locals.meta.og.imageAlt = 'nsidr / archive';
    locals.meta.og.url = `${keystone.get('root')}/archive`;

    if (!locals.badFilter) {
      const articles = keystone.list('NSiderArticle').model.find()
        .select('slug title publishedDate isVisible blurb image authors')
        .where('isVisible').ne('recalled')
        .sort('-publishedDate')
        .skip(params.page ? (params.page - 1) * perPage : 0)
        .limit(perPage);

      const countArticles = keystone.list('NSiderArticle').model.find()
        .select('isVisible publishedDate')
        .where('isVisible').ne('recalled')
        .sort('-publishedDate');

      locals.filters.forEach((filter) => {
        articles.where(filter.field).in([filter.id]);
        countArticles.where(filter.field).in([filter.id]);
        filterQuerystring += `&${filter.field}=${filter.value}`;
      });

      if (params.authors) {
        locals.currentAuthors = params.authors;
        articles.elemMatch('authors', {
          'name.first': params.authors.split(' ')[0],
          'name.last': params.authors.split(' ').slice(1).join(' ')
        });
        countArticles.elemMatch('authors', {
          'name.first': params.authors.split(' ')[0],
          'name.last': params.authors.split(' ').slice(1).join(' ')
        });
        filterQuerystring += `&authors=${params.authors}`;
      }

      articles.exec((err, result) => {
        if (result) {
          countArticles.count().exec((countErr, totalCount) => {
            locals.articles = result;
            locals.pagination = {
              prev: page > 1 ? `/archive?page=${page - 1}${filterQuerystring}` : undefined,
              current: page,
              total: Math.ceil(totalCount / perPage),
              next: (totalCount - (page * perPage)) > 0
                ? `/archive?page=${page + 1}${filterQuerystring}` : undefined
            };
            next();
          });
        } else {
          next(new Error('Articles not found'));
        }
      });
    } else {
      next();
    }
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
      keystone.get('vue path'),
      '/scripts/lib/vue-resource.min.js',
      '/scripts/articles.js'
    ];
    locals.layoutClass = 'list-view';
    return view.res.render('articles', locals);
  });
};
