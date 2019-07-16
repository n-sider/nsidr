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
  featureImagePlacement: {
    type: Types.Select,
    options: [
      { value: 'pull', label: 'Use first inline image and move to top of post' },
      { value: 'leave', label: 'Use first inline image but leave in place' },
    ],
    default: 'pull',
    emptyOption: false,
    label: 'Feature Image'
  },
  publishedDate: { type: Types.Datetime },
  legacyId: { type: Types.Number, hidden: true },
  tags: { type: Types.Relationship, ref: 'Tag', many: true },
  authors: { type: Types.Relationship, ref: 'User', many: true },
  topic: {
    type: Types.Select,
    options: [
      { value: 'nsidr', label: 'nsidr' },
      { value: 'hyrule', label: 'The Hyrule Fantasy' },
      { value: 'fami', label: 'Famiculture' }
    ],
    default: 'nsidr',
    emptyOption: false
  },
  mood: {
    type: Types.Select,
    options: [
      'Default', 'Hey', 'Bashful', 'Irate', 'Shocked', 'Null', 'Goofball', 'Face'
    ],
    default: 'Default',
    emptyOption: false
  },
  reactions: {
    type: Types.Relationship,
    ref: 'Reaction',
    many: true,
    hidden: true
  },
  twitterLink: { type: Types.Text },
  facebookLink: { type: Types.Text }
});

Post.schema.virtual('featured').get(function () {
  return (
    this.publishedDate > moment().subtract(14, 'months').toDate() // TODO: ha ha wow undo
      && this.publishedDate < new Date()
  );
});
Post.schema.virtual('featureImage').get(function () {
  const matched = this.content.match(/<img.*?src="([^"]*)/i);
  return matched ? matched[1] : null;
});
Post.schema.virtual('shouldMoveFeatureImage').get(function () {
  return this.featureImage && this.featureImagePlacement !== 'leave';
});
Post.schema.virtual('cleanContent').get(function () {
  return this.content.replace(/<[^>]*>/gi, '');
});
Post.schema.virtual('contentMinusFeatureImage').get(function () {
  const regex = new RegExp(
    '(<(p|div)[^>]*?>)?\\s*?(<a[^>]*?>)?\\s*?<img[^>]*?>\\s*?(</a>)?\\s*?(</(?:p|div)>)?((<br[^>]*?>)?\\s*?)*',
    'i'
  );
  return this.shouldMoveFeatureImage ? this.content.replace(regex, '') : this.content;
});
Post.schema.virtual('brief').get(function () {
  const matches = this.cleanContent.match(/(.|\r|\n){600}[^ ]*/);
  const brief = matches ? `${matches[0]}...` : this.cleanContent;
  return brief;
});
Post.schema.virtual('displayDate').get(function () {
  return moment(this.publishedDate).format('MMM D, YYYY');
});
Post.schema.virtual('reactionSummary').get(function () {
  const summary = {
    total: 0,
    thumbsUp: 0,
    laugh: 0,
    wow: 0,
    sad: 0
  };
  this.reactions.forEach((reaction) => {
    summary.total++;
    summary[reaction.type === 'thumbs-up' ? 'thumbsUp' : reaction.type]++;
  });
  return summary;
});
Post.schema.virtual('multipleTags').get(function () {
  return this.tags && this.tags.length > 1;
});
Post.schema.virtual('multipleAuthors').get(function () {
  return this.authors && this.authors.length > 1;
});
Post.schema.virtual('twitter').get(function () {
  return this.twitterLink || 'https://twitter.com/nsidr';
});
Post.schema.virtual('facebook').get(function () {
  return this.facebookLink || 'https://www.facebook.com/nsidr/';
});

Post.defaultColumns = 'title, publishedDate';

Post.schema.plugin((schema) => { schema.options.usePushEach = true; });

Post.register();
