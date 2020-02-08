const keystone = require('keystone');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    const query = {
      slug: req.params.slug
    };

    if (req.query.id) {
      query['_id'] = req.query.id;
    } else {
      query.publishedDate = { $lt: new Date() };
    }

    const post = keystone.list('Post').model.findOne(query);

    post.populate('authors tags').exec((err, result) => {
      if (result) {
        locals.post = result.toObject();

        locals.meta.title = `nsidr / ${locals.post.title}`;
        locals.meta.description = locals.post.brief || locals.meta.description;
        locals.meta.og.title = locals.post.title;
        locals.meta.og.type = 'article';
        locals.meta.og.description = locals.meta.description;
        locals.meta.og.image = locals.post.featureImage || locals.meta.og.image;
        locals.meta.og.imageAlt = locals.post.title;
        locals.meta.og.url = `${keystone.get('root')}/posts/${locals.post.slug}`;
      } else {
        err = new Error('Post not found');
      }
      next(err);
    });
  });

  view.on('init', (next) => {
    const posts = keystone.list('Post').model.find()
      .where('publishedDate').lt(new Date())
      .where('_id').ne(locals.post['_id'])
      .sort('-publishedDate')
      .limit(3);

    posts.populate('authors').exec((err, result) => {
      if (result) {
        locals.posts = result.map(obj => obj.toObject());
      } else {
        err = new Error('Posts not found');
      }
      next(err);
    });
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
      '/scripts/post.js'
    ];
    locals.layoutClass = 'content-view';
    return view.res.render('post', locals);
  });
};
