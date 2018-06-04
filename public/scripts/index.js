const continueTarget = document.querySelector('.continue-reading a');

if (continueTarget) {
  continueTarget.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('scrollFeature', window.pageYOffset);
    window.location.href = document.querySelector('.continue-reading a');
  });
}
