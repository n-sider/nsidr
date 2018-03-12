const keystone = require('keystone');
const importRoutes = keystone.importer(__dirname);

const routes = {
  views: importRoutes('./views'),
};

exports = module.exports = (app) => {
  app.get('/', routes.views.index)
};
