document.addEventListener('DOMContentLoaded', () => {
  const scrollTarget = sessionStorage.getItem('scrollFeature');

  if (scrollTarget !== null && scrollTarget > 0) {
    window.scroll({ top: scrollTarget, behavior: 'smooth' });
  }
  sessionStorage.removeItem('scrollFeature');

  document.querySelector('.post-footer .top-icon').addEventListener('click', () => {
    window.scroll({ top: 0, behavior: 'instant' });
  });
});

new Vue({
  el: '#post',
  delimiters: ['${', '}'],
  data: {
    slug: document.querySelector('#post').getAttribute('data-post-slug'),
    postTotals: {
      total: 0,
      thumbsUp: 0,
      laugh: 0,
      wow: 0,
      sad: 0
    },
    reactionOptions: [
      { name: 'thumbs-up', fa: 'fas fa-thumbs-up' },
      { name: 'laugh', fa: 'fas fa-laugh-squint' },
      { name: 'wow', fa: 'fas fa-surprise' },
      { name: 'sad', fa: 'fas fa-sad-tear' }
    ],
    selectedReaction: null,
    savedReactionId: null,
    userReactions: [],
    feedbackFocused: false
  },
  created: function () {
    this.userReactions = JSON.parse(window.localStorage.getItem('reactions')) || [];
    const foundReaction = this.userReactions.find(reaction => this.slug === reaction.slug);

    if (foundReaction) {
      this.selectedReaction = foundReaction.reaction;
      this.savedReactionId = foundReaction.reactionId;
    }

    this.$http.get(`/api/posts/${this.slug}/reactions`).then((response) => {
      this.postTotals = response.body;
    });
  },
  methods: {
    react: function (reaction) {
      const oldName = this.selectedReaction ? this.selectedReaction.name : null;
      this.selectedReaction = reaction;

      if (this.selectedReaction) {
        this.$http.post('/api/reactions', {
          slug: this.slug,
          reaction: this.selectedReaction.name
        }).then((response) => {
          this.postTotals.total++;
          this.postTotals[this.selectedReaction.name === 'thumbs-up' ? 'thumbsUp' : this.selectedReaction.name]++;
          this.savedReactionId = response.body.reactionId;
          this.userReactions.push({
            slug: this.slug,
            reaction: this.selectedReaction,
            reactionId: this.savedReactionId
          });
          window.localStorage.setItem('reactions', JSON.stringify(this.userReactions));
        });
      } else {
        this.$http.delete(`/api/reactions/${this.slug}/${this.savedReactionId}`).then(() => {
          this.postTotals.total--;
          this.postTotals[oldName === 'thumbs-up' ? 'thumbsUp' : oldName]--;
          this.userReactions.forEach((item, index) => {
            if (item.reactionId === this.savedReactionId) {
              this.userReactions.splice(index, 1);
            }
          });
          this.savedReactionId = null;
          window.localStorage.setItem('reactions', JSON.stringify(this.userReactions));
        });
      }
    },
    scrollToReact: function () {
      document.querySelector('.post-feedback').scrollIntoView();
      this.feedbackFocused = true;
    }
  }
});
