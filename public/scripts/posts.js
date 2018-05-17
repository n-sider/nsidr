new Vue({
  el: '#tag-search',
  delimiters: ['${', '}'],
  data: {
    searchTerm: document.querySelector('#tag-search input').getAttribute('data-starting-value'),
    tags: [],
    matchedTags: [],
    selectedIndex: null
  },
  created: function () {
    this.$http.get('/api/tags').then((response) => {
      this.tags = response.body;
    });
  },
  methods: {
    autoComplete: function (e) {
      this.searchTerm = e.target.value;
      if (this.searchTerm.length > 1) {
        const workingTags = [];
        this.tags.forEach((tag) => {
          if (tag.name.match(new RegExp(this.searchTerm, 'ig'))) {
            workingTags.push(tag);
          }
        });
        this.matchedTags = workingTags.slice(0, 10);
        this.selectedIndex = 0;
      } else {
        this.matchedTags = [];
        this.selectedIndex = null;
      }
    },
    selectedClass: function (index) {
      return index === this.selectedIndex;
    },
    selectDown: function (e) {
      e.preventDefault();
      if (this.selectedIndex >= 0) {
        if (this.selectedIndex === this.matchedTags.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
        }
      }
    },
    selectUp: function (e) {
      e.preventDefault();
      if (this.selectedIndex >= 0) {
        if (this.selectedIndex === 0) {
          this.selectedIndex = this.matchedTags.length - 1;
        } else {
          this.selectedIndex--;
        }
      }
    },
    selectFollow: function () {
      if (this.selectedIndex >= 0) {
        window.location.href = `/posts?tags=${encodeURIComponent(this.matchedTags[this.selectedIndex].name)}`;
      }
    }
  }
});
