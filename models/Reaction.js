const keystone = require('keystone');

const { Types } = keystone.Field;

const Reaction = new keystone.List('Reaction', {
  hidden: true
});

Reaction.add({
  type: {
    type: Types.Select,
    options: [
      { value: 'thumbs-up', label: 'Thumbs Up' },
      { value: 'laugh', label: 'Laugh' },
      { value: 'wow', label: 'Wow!' },
      { value: 'sad', label: 'Sad' }
    ],
    default: 'thumbs-up',
    emptyOption: false
  }
});

Reaction.register();
