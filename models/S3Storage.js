const keystone = require('keystone');
const adapter = require('keystone-storage-adapter-s3');

const S3Config = keystone.get('s3 config');

module.exports = new keystone.Storage({
  adapter: adapter,
  s3: {
    key: S3Config.key,
    secret: S3Config.secret,
    bucket: S3Config.bucket,
    headers: {
      'x-amz-acl': 'public-read',
    }
  },
  schema: {
    url: true
  }
});
