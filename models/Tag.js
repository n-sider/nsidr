const keystone = require('keystone');

const { Types } = keystone.Field;

const Tag = new keystone.List('Tag');

Tag.add({
  name: { type: Types.Text, required: true, initial: true },
  legacyId: { type: Types.Number, hidden: true }
});

Tag.schema.virtual('encodedName').get(function () {
  return encodeURIComponent(this.name);
});
Tag.schema.set('toObject', { virtuals: true });

Tag.defaultColumns = 'name';

Tag.register();
