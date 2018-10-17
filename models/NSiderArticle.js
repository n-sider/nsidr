const keystone = require('keystone');
const moment = require('moment');

const { Types } = keystone.Field;

const NSiderArticle = new keystone.List('NSiderArticle', {
  autokey: { path: 'slug', from: 'title', unique: true },
  defaultSort: '-publishedDate',
  label: 'N-Sider Articles',
  map: { name: 'title' }
});

NSiderArticle.add({
  title: { type: Types.Text, required: true, initial: true },
  url: {
    type: Types.Url,
    watch: true,
    noedit: true,
    value: function () { return `${keystone.get('root')}/archive/${this.slug}`; },
    label: 'Site URL'
  },
  publishedDate: { type: Types.Datetime },
  isVisible: {
    type: Types.Select,
    options: [
      { value: 'visible', label: 'Visible' },
      { value: 'recalled', label: 'Recalled' }
    ],
    default: 'visible',
    emptyOption: false,
    label: 'Visibility'
  },
  blurb: { type: Types.Html, height: 150, wysiwyg: false },
  image: { type: Types.Text, label: 'Thumbnail Image URL' },
  tags: { type: Types.Relationship, ref: 'NSiderTag', many: true },
  style: { type: Types.Textarea, height: 150, label: 'Style (CSS)' },
  legacyId: { type: Types.Number, index: true, hidden: true },
  pages: {
    type: Types.List,
    fields: {
      pageNumber: { type: Types.Number },
      content: { type: Types.Html, height: 400, wysiwyg: false },
      sidebar: { type: Types.Html, height: 150, wysiwyg: false }
    }
  },
  authors: {
    type: Types.List,
    fields: {
      name: { type: Types.Name },
      displayOrder: { type: Types.Number },
      isMinor: { type: Types.Boolean, label: 'Minor Contributor?' }
    }
  }
});

NSiderArticle.schema.virtual('displayDate').get(function () {
  return moment(this.publishedDate).format('MMM D, YYYY');
});
NSiderArticle.schema.virtual('multipleTags').get(function () {
  return this.tags && this.tags.length > 1;
});
NSiderArticle.schema.virtual('multipleAuthors').get(function () {
  return this.authors && this.authors.length > 1;
});

NSiderArticle.defaultColumns = 'title, publishedDate';

NSiderArticle.register();
