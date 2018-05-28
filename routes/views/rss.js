const keystone = require('keystone');
const RSS = require('rss');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const { locals } = res;

  view.on('init', (next) => {
    const posts = keystone.list('Post').model.find()
      .where('publishedDate').lt(new Date())
      .sort('-publishedDate')
      .limit(10);

    posts.populate('authors').exec((err, result) => {
      if (result) {
        const feed = new RSS({
          title: 'nsidr',
          description: 'The latest updates from nsidr.com.',
          feed_url: `${keystone.get('root')}/rss`,
          site_url: keystone.get('root'),
          copyright: `Copyright ${new Date().getFullYear()} N-Sider Media`,
          language: 'en',
          pubDate: new Date(result[0].publishedDate)
        });

        result.forEach((post) => {
          feed.item({
            title: post.title,
            description: post.content,
            url: `${keystone.get('root')}/posts/${post.slug}`,
            guid: post.slug,
            author: (() => {
              const authors = [];
              post.authors.forEach((author) => {
                authors.push(author.name.full);
              });
              return authors.join(', ');
            })(),
            date: new Date(post.publishedDate)
          });
        });

        locals.xml = feed.xml({ indent: '  ' });
      }
      next();
    });
  });

  view.render(() => {
    view.res.type('text/xml');
    return view.res.send(locals.xml);
  });
};
