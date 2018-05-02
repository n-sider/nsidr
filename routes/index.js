const keystone = require('keystone');
const middleware = require('./middleware');

keystone.pre('routes', middleware.initLocals);

const importRoutes = keystone.importer(__dirname);
const routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api')
};

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
  app.get('/archive/:slug/:page?', routes.views.article);

  // API
  app.get('/api/tags', keystone.middleware.api, routes.api.tags.get);
};
