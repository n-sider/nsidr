require('dotenv').config();

const keystone = require('keystone');
const handlebars = require('express-handlebars');
const helpers = require('./templates/helpers.js');

keystone.init({
  name: 'nsidr',

  less: 'public',
  static: 'public',

  views: 'templates/views',
  'view engine': 'hbs',
  'custom engine': handlebars.create({
    layoutsDir: 'templates/views/layouts',
    partialsDir: 'templates/views/partials',
    defaultLayout: 'template',
    helpers: helpers,
    extname: '.hbs'
  }).engine,

  'auto update': true,
  compress: true,

  mongo: process.env.MONGO_URI,
  'session store': 'mongo',
  auth: true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET,

  'wysiwyg s3 images': true,
  'wysiwyg importcss': '/styles/tinymce.css',
  'wysiwyg additional options': { entity_encoding: 'raw' },
  'trust proxy': true
});

const s3Settings = {
  bucket: process.env.S3FILE_BUCKET,
  key: process.env.S3FILE_KEY,
  secret: process.env.S3FILE_SECRET,
  root: `https://${process.env.S3FILE_BUCKET}`
};
keystone.set('s3 config', s3Settings);
keystone.set('root', 'https://www.nsidr.com');
keystone.set('port', 8081);
keystone.set('vue path', keystone.get('env') === 'production' ? '/scripts/lib/vue.min.js' : '/scripts/lib/vue.js');

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.set('nav', {
  nsidr: ['Post', 'Tag'],
  'Archived N-Sider': ['NSiderArticle', 'NSiderTag']
});

keystone.start();
