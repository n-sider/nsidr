module.exports = (req, res) => {
  if (req.params.slug) {
    res.status(301).redirect(`/posts/${req.params.slug}`);
  } else {
    return res.render('404', {
      meta: {
        title: 'nsidr / 404'
      },
      layoutClass: 'not-found-view'
    });
  }
};
