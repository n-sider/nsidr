module.exports = {
  getMood: (user, mood) => {
    if (user) {
      const { filename } = user[`avatar${(mood !== 'Default' && mood) || ''}`];
      return `https://${process.env.S3FILE_BUCKET}/${filename}`;
    }
    return '';
  }
};
