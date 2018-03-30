require('dotenv').config();

const keystone = require('keystone');
const handlebars = require('express-handlebars');

keystone.init({
  name: 'nsidr',

  less: 'public',
  static: 'public',

  views: 'templates/views',
  'view engine': 'hbs',
  'custom engine': handlebars.create({
    layoutsDir: 'templates/views/layouts',
    partialsDir: 'templates/views/partials',
    defaultLayout: 'default',
    // helpers: new require( './templates/views/helpers' )(),
    extname: '.hbs'
  }).engine,

  'auto update': true,

  session: true,
  auth: true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET,

  'wysiwyg s3 images': true
});

const s3Settings = {
  bucket: process.env.S3FILE_BUCKET,
  key: process.env.S3FILE_KEY,
  secret: process.env.S3FILE_SECRET
};
keystone.set('s3 config', s3Settings);

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.set('nav', {
  nsidr: ['Post', 'Tag'],
  'Archived N-Sider': ['NSiderArticle', 'NSiderTag']
});

keystone.start();
