const keystone = require('keystone');

const { Types } = keystone.Field;

const NSiderTag = new keystone.List('NSiderTag', {
  label: 'N-Sider Article Tags'
});

NSiderTag.add({
  name: { type: Types.Text, required: true, initial: true },
  description: { type: Types.Html, wysiwyg: false, height: 150 },
  legacyId: { type: Types.Number, hidden: true }
});

NSiderTag.defaultColumns = 'name';

NSiderTag.register();
