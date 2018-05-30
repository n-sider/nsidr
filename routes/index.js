const keystone = require('keystone');
const middleware = require('./middleware');

keystone.pre('routes', middleware.initLocals);

const importRoutes = keystone.importer(__dirname);
const routes = {
  views: importRoutes('./views'),
  redirects: importRoutes('./redirects'),
  api: importRoutes('./api')
};

keystone.set('404', (req, res) => {
  res.status(404).render('404', {
    meta: {
      title: 'nsidr / 404'
    },
    layoutClass: 'not-found-view'
  });
});

module.exports = (app) => {
  // Views
  app.get('/', routes.views.index);
  app.get('/posts/:slug?', (req, res) => {
    if (req.params.slug) {
      routes.views.post(req, res);
    } else {
      routes.views.posts(req, res);
    }
  });
  app.get('/archive/:slug?/:page?', (req, res) => {
    if (req.params.slug) {
      routes.views.article(req, res);
    } else {
      routes.views.articles(req, res);
    }
  });
  app.get('/rss', routes.views.rss);

  // Legacy redirects
  app.get('/contentview.php', routes.redirects.contentview);
  app.get('/blog/:year/:month/:slug', routes.redirects.blog);

  // API
  app.get('/api/tags', keystone.middleware.api, routes.api.tags.get);
  app.get('/api/nsider-tags', keystone.middleware.api, routes.api.nsiderTags.get);
};
