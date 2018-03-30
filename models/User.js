const keystone = require('keystone');

const { Types } = keystone.Field;

const User = new keystone.List('User');

User.add({
  name: { type: Types.Name },
  legacyId: { type: Types.Number, hidden: true },
  email: { type: Types.Email, unique: true },
  password: { type: Types.Password },
  isAdmin: { type: Types.Boolean, label: 'Admin Access' }
});

User.schema.virtual('canAccessKeystone').get(function needThis() { return this.isAdmin; });

User.defaultColumns = 'name, email, isAdmin';

User.register();
