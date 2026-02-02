// BRUTALIST SITE - MINIMAL JAVASCRIPT
// Nicholas Guerriero

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('.footer p');
  if (footer) {
    footer.textContent = `© ${new Date().getFullYear()} Nicholas Guerriero`;
  }

  console.log('%c NICHOLAS GUERRIERO ', 'background: #000; color: #00FF00; font-size: 20px; font-weight: bold; padding: 10px;');
  console.log('%c Builder. Entrepreneur. ', 'color: #666; font-size: 14px;');
  console.log('%c nick@mountainwestsurface.com ', 'color: #00FF00; font-size: 12px;');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// That's it. Fast. Simple. Brutal.
