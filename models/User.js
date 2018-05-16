const keystone = require('keystone');
const storage = require('./S3Storage');

const { Types } = keystone.Field;
const staticRoot = keystone.get('s3 config').root;

const User = new keystone.List('User');

User.add({
  name: { type: Types.Name },
  legacyId: { type: Types.Number, hidden: true },
  email: { type: Types.Email, unique: true },
  password: { type: Types.Password },
  avatar: { type: Types.File, storage: storage },
  isAdmin: { type: Types.Boolean, label: 'Admin Access' }
});

User.schema.virtual('canAccessKeystone').get(function () { return this.isAdmin; });
User.schema.virtual('avatarPath').get(function () {
  return `${staticRoot}/${this.avatar.filename}`;
});

User.defaultColumns = 'name, email, isAdmin';

User.register();
