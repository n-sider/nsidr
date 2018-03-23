const keystone = require('keystone');
const Types = keystone.Field.Types;

const NSiderArticle = new keystone.List('NSiderArticle', {
  autokey: { path: 'slug', from: 'urlFragment', unique: true },
  defaultSort: '-publishedDate',
  label: 'Archived N-Sider Articles',
  map: { name: 'title' }
});

NSiderArticle.add({
  title: { type: Types.Text, required: true, initial: true },
  urlFragment: { type: Types.Text, required: true, initial: true, label: 'URL Fragment' },
  publishedDate: { type: Types.Datetime },
  blurb: { type: Types.Html, height: 50, wysiwyg: false },
  spill: { type: Types.Html, height: 150, wysiwyg: false, label: "Spill Text" },
  image: { type: Types.Text, label: 'Thumbnail Image URL' },
  tags: { type: Types.Relationship, ref: 'NSiderTag', many: true },
  style: { type: Types.Textarea, height: 150, label: 'Style (CSS)' },
  legacyId: { type: Types.Number, label: 'Legacy ID' },
  pages: { type: Types.List, fields: {
    pageNumber: { type: Types.Number },
    content: { type: Types.Html, height: 350, wysiwyg: false },
    sidebar: { type: Types.Html, height: 150, wysiwyg: false }
  } },
  authors: { type: Types.List, fields: {
    name: { type: Types.Name },
    displayOrder: { type: Types.Number },
    isMinor: { type: Types.Boolean, label: 'Minor Contributor?' }
  } }
});

NSiderArticle.defaultColumns = 'title, publishedDate';

NSiderArticle.register();
