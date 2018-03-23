const keystone = require('keystone');
const Types = keystone.Field.Types;

const Tag = new keystone.List('Tag');

Tag.add({
  name: { type: Types.Text, required: true, initial: true }
});

Tag.defaultColumns = 'name';

Tag.register();
