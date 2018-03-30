exports.initLocals = (req, res, next) => {
  const { locals } = res;

  locals.user = req.user;
  locals.meta = {
    title: 'nsidr'
  };

  next();
};
