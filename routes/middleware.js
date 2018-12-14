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
      type: 'website',
      description: 'nsidr.com, a fansite from a bygone era for Nintendo fans who still need to write.',
      image: 'https://www.nsidr.com/logo-full.png',
      imageAlt: 'nsidr',
      url: keystone.get('root'),
      facebook: process.env.FB_APP_ID,
      twitter: process.env.TWITTER_USERNAME
    },
    analytics: process.env.GOOGLE_ANALYTICS
  };

  next();
};
