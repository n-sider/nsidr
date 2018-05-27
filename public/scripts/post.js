const scrollTarget = sessionStorage.getItem('scrollFeature');

if (scrollTarget !== null && scrollTarget - 10 > 0) {
  window.scroll({ top: scrollTarget - 10, behavior: 'smooth' });
}
sessionStorage.removeItem('scrollFeature');

document.querySelector('.post-footer .top-icon').addEventListener('click', () => {
  window.scroll({ top: 0, behavior: 'instant' });
});
