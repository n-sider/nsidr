const scrollTarget = sessionStorage.getItem('scrollFeature');

if (scrollTarget !== null && scrollTarget - 10 > 0) {
  window.scroll({ top: scrollTarget - 10, behavior: 'smooth' });
}
sessionStorage.removeItem('scrollFeature');
