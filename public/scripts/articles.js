new Vue({
  el: '#tag-search',
  delimiters: ['${', '}'],
  data: {
    showSearch: false,
    searchTerm: document.querySelector('#tag-search input').getAttribute('data-starting-value'),
    tags: [],
    matchedTags: [],
    selectedIndex: null,
    searchPerformed: false
  },
  created: function () {
    this.$http.get('/api/nsider-tags').then((response) => {
      this.tags = response.body;
    });
  },
  methods: {
    toggleSearch: function (event) {
      event.preventDefault();
      this.showSearch = !this.showSearch;
    },
    autoComplete: function (event) {
      this.searchPerformed = true;
      this.searchTerm = event.target.value;
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
    selectDown: function (event) {
      event.preventDefault();
      if (this.selectedIndex >= 0) {
        if (this.selectedIndex === this.matchedTags.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
        }
      }
    },
    selectUp: function (event) {
      event.preventDefault();
      if (this.selectedIndex >= 0) {
        if (this.selectedIndex === 0) {
          this.selectedIndex = this.matchedTags.length - 1;
        } else {
          this.selectedIndex--;
        }
      }
    },
    selectFollow: function () {
      if (this.selectedIndex !== null && this.selectedIndex >= 0) {
        window.location.href = `/archive?tags=${encodeURIComponent(this.matchedTags[this.selectedIndex].name)}`;
      } else if (!this.searchTerm) {
        window.location.href = '/archive';
      }
    },
    selectTag: function (index) {
      this.selectedIndex = index;
    }
  }
});
