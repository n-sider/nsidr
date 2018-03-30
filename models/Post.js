const keystone = require('keystone');

const { Types } = keystone.Field;

const Post = new keystone.List('Post', {
  autokey: { path: 'slug', from: 'title', unique: true },
  defaultSort: '-publishedDate',
  map: { name: 'title' }
});

Post.add({
  title: { type: Types.Text, required: true, initial: true },
  url: {
    type: Types.Url,
    watch: true,
    noedit: true,
    value: () => `http://www.nsidr.com/posts/${this.slug}?id=${this.id}`,
    label: 'Preview URL'
  },
  content: { type: Types.Html, height: 550, wysiwyg: true },
  publishedDate: { type: Types.Datetime, note: 'Set to present/past value to publish' },
  legacyId: { type: Types.Number },
  tags: { type: Types.Relationship, ref: 'Tag', many: true },
  authors: { type: Types.Relationship, ref: 'User', many: true }
});

Post.defaultColumns = 'title, publishedDate';

Post.register();
