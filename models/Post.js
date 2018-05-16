const keystone = require('keystone');
const moment = require('moment');

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
    value: function () { return `${keystone.get('root')}/posts/${this.slug}?id=${this.id}`; },
    label: 'Preview URL'
  },
  content: { type: Types.Html, height: 550, wysiwyg: true },
  publishedDate: { type: Types.Datetime, note: 'Set to present/past value to publish' },
  legacyId: { type: Types.Number },
  tags: { type: Types.Relationship, ref: 'Tag', many: true },
  authors: { type: Types.Relationship, ref: 'User', many: true }
});

Post.schema.virtual('featured').get(function () {
  return (
    this.publishedDate > moment().subtract(7, 'months').toDate() && // TODO: change to days
      this.publishedDate < new Date()
  );
});
Post.schema.virtual('cleanContent').get(function () {
  return this.content.replace(/<[^>]*>/gi, '');
});
Post.schema.virtual('displayDate').get(function () {
  return moment(this.publishedDate).format('MMMM D, YYYY');
});

Post.defaultColumns = 'title, publishedDate';

Post.register();
