const keystone = require('keystone');
const Types = keystone.Field.Types;

const NSiderArticle = new keystone.List('NSiderArticle', {
  autokey: { path: 'slug', from: 'title', unique: true },
  defaultSort: '-publishedDate',
  label: 'N-Sider Articles',
  map: { name: 'title' }
});

NSiderArticle.add({
  title: { type: Types.Text, required: true, initial: true },
  url: { type: Types.Url, watch: true, noedit: true,
    value: function () { return "http://www.nsidr.com/archive/" + this.slug + "?id=" + this.id; }, label: "Preview URL" },
  publishedDate: { type: Types.Datetime },
  blurb: { type: Types.Html, height: 50, wysiwyg: false },
  spill: { type: Types.Html, height: 150, wysiwyg: false, label: "Spill Text" },
  image: { type: Types.Text, label: 'Thumbnail Image URL' },
  tags: { type: Types.Relationship, ref: 'NSiderTag', many: true },
  style: { type: Types.Textarea, height: 150, label: 'Style (CSS)' },
  legacyId: { type: Types.Number, label: 'Legacy ID', note: "Corresponds to ID on old site, for redirects" },
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
