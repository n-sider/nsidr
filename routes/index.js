const keystone = require('keystone');
const middleware = require('./middleware');

keystone.pre('routes', middleware.initLocals);

const importRoutes = keystone.importer(__dirname);
const routes = {
  views: importRoutes('./views'),
};

module.exports = (app) => {
  app.get('/', routes.views.index);
  app.get('/posts/:slug', routes.views.post);
};
