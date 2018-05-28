const keystone = require('keystone');

exports.initLocals = (req, res, next) => {
  const { locals } = res;

  locals.user = req.user;
  locals.meta = {
    title: 'nsidr',
    description: 'nsidr.com, a fansite from a bygone era for Nintendo fans who still need to write.',
    og: {
      siteName: 'nsidr',
      title: 'nsidr',
      description: 'nsidr.com, a fansite from a bygone era for Nintendo fans who still need to write.',
      image: 'https://www.nsidr.com/logo-full.png',
      imageAlt: 'nsidr',
      url: keystone.get('root'),
      facebook: process.env.FB_APP_ID,
      twitter: process.env.TWITTER_USERNAME
    }
  };

  if (keystone.get('env') === 'production' && req.protocol === 'http') {
    return res.redirect(keystone.get('root') + req.originalUrl);
  }

  next();
};
