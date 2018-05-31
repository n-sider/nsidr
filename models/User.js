const keystone = require('keystone');
const storage = require('./S3Storage');

const { Types } = keystone.Field;

const User = new keystone.List('User');

User.add({
  name: { type: Types.Name },
  legacyId: { type: Types.Number, hidden: true },
  email: { type: Types.Email, unique: true },
  password: { type: Types.Password },
  avatar: { type: Types.File, storage: storage, label: 'Default Avatar' },
  avatarHey: { type: Types.File, storage: storage, label: 'Mood: Hey' },
  avatarBashful: { type: Types.File, storage: storage, label: 'Mood: Bashful' },
  avatarIrate: { type: Types.File, storage: storage, label: 'Mood: Irate' },
  avatarShocked: { type: Types.File, storage: storage, label: 'Mood: Shocked' },
  avatarNull: { type: Types.File, storage: storage, label: 'Mood: Null' },
  avatarGoofball: { type: Types.File, storage: storage, label: 'Mood: Goofball' },
  avatarFace: { type: Types.File, storage: storage, label: 'Mood: Face' },
  isAdmin: { type: Types.Boolean, label: 'Admin Access' }
});

User.schema.virtual('canAccessKeystone').get(function () { return this.isAdmin; });

User.defaultColumns = 'name, email, isAdmin';

User.register();
