const keystone = require('keystone');
const Types = keystone.Field.Types;

const NSiderTag = new keystone.List('NSiderTag', {
  label: 'N-Sider Article Tags'
});

NSiderTag.add({
  name: { type: Types.Text, required: true, initial: true },
  description: { type: Types.Textarea, height: 50 }
});

NSiderTag.defaultColumns = 'name';

NSiderTag.register();
