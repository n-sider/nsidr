const keystone = require('keystone');

exports.initLocals = (req, res, next) => {
  const { locals } = res;

  locals.user = req.user;
  locals.meta = {
    title: 'nsidr'
  };

  if (keystone.get('env') === 'production' && req.protocol === 'http') {
    return res.redirect(keystone.get('root') + req.originalUrl);
  }

  next();
};
