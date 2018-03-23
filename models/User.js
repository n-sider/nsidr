const keystone = require('keystone');
const Types = keystone.Field.Types;

const User = new keystone.List('User');

User.add({
  name: { type: Types.Name },
  email: { type: Types.Email, unique: true },
  password: { type: Types.Password },
  isAdmin: { type: Types.Boolean, label: 'Admin Access' }
});

User.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin;
});

User.defaultColumns = 'name, email';

User.register();
