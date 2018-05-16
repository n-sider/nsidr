document.querySelector('.continue-reading a').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('body').classList.add('expand-feature');
});
