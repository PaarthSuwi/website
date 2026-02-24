const fadeNodes = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.15 }
);
fadeNodes.forEach(node => observer.observe(node));

const uploadZone = document.querySelector('.upload-zone');
if (uploadZone) {
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, e => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, e => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });
  });
}

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.style.transform = `translateY(${window.scrollY * 0.12}px)`;
});
