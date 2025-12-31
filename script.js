// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll reveal animation for sections
const revealSections = () => {
  const sections = document.querySelectorAll('section');
  const windowHeight = window.innerHeight;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const revealPoint = 100;

    if (sectionTop < windowHeight - revealPoint) {
      section.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Blog modal functionality
const blogModal = document.getElementById('blogModal');
const blogModalBody = document.getElementById('blogModalBody');
const blogModalClose = document.querySelector('.blog-modal-close');

// Open blog modal
document.querySelectorAll('.read-more').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const blogId = e.currentTarget.getAttribute('data-blog');
    const blogContent = document.getElementById(blogId);

    if (blogContent && blogModal && blogModalBody) {
      blogModalBody.innerHTML = blogContent.innerHTML;
      blogModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close blog modal
if (blogModalClose) {
  blogModalClose.addEventListener('click', () => {
    blogModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === blogModal) {
    blogModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && blogModal.style.display === 'block') {
    blogModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ===== MEOW WOLF INTERACTIVE FEATURES =====

// Random glitch effect on title
setInterval(() => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && Math.random() > 0.95) {
    heroTitle.classList.add('glitch');
    setTimeout(() => {
      heroTitle.classList.remove('glitch');
    }, 300);
  }
}, 2000);

// Mouse trail effect with neon particles
let particles = [];
const colors = ['#FF006E', '#00D9FF', '#39FF14', '#B026FF', '#FF6B00'];

document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.9) {
    createParticle(e.clientX, e.clientY);
  }
});

function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.width = '5px';
  particle.style.height = '5px';
  particle.style.borderRadius = '50%';
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '9998';
  particle.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;
  particle.style.transition = 'all 1s ease-out';

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.style.opacity = '0';
    particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0)`;
  }, 10);

  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join('').toLowerCase() === konamiSequence.join('').toLowerCase()) {
    activateMatrixMode();
  }
});

function activateMatrixMode() {
  const body = document.body;
  const originalFilter = body.style.filter;

  body.style.filter = 'hue-rotate(120deg) saturate(2)';

  // Create "MATRIX ACTIVATED" message
  const message = document.createElement('div');
  message.textContent = '🎮 MATRIX MODE ACTIVATED 🎮';
  message.style.position = 'fixed';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.fontSize = '3rem';
  message.style.color = '#39FF14';
  message.style.textShadow = '0 0 20px #39FF14';
  message.style.zIndex = '99999';
  message.style.fontWeight = '900';
  message.style.animation = 'glitch 0.3s infinite';
  message.style.pointerEvents = 'none';

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
    body.style.filter = originalFilter;
  }, 3000);
}

// Secret click counter on logo
let logoClicks = 0;
const navLogo = document.querySelector('.nav-logo');

navLogo.addEventListener('click', (e) => {
  e.preventDefault();
  logoClicks++;

  if (logoClicks === 5) {
    showSecretMessage();
    logoClicks = 0;
  }
});

function showSecretMessage() {
  const messages = [
    '👾 You found a secret! 👾',
    '🌀 Reality is optional 🌀',
    '✨ Welcome to the void ✨',
    '🔮 The matrix has you 🔮',
    '🎨 Art is everywhere 🎨'
  ];

  const message = document.createElement('div');
  message.textContent = messages[Math.floor(Math.random() * messages.length)];
  message.style.position = 'fixed';
  message.style.top = '20%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.fontSize = '2rem';
  message.style.color = '#FF006E';
  message.style.textShadow = '0 0 20px #FF006E';
  message.style.zIndex = '99999';
  message.style.fontWeight = '900';
  message.style.animation = 'glitch 0.3s infinite';
  message.style.pointerEvents = 'none';
  message.style.padding = '2rem';
  message.style.background = 'rgba(0, 0, 0, 0.9)';
  message.style.border = '2px solid #FF006E';

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.transition = 'all 0.5s ease';
    message.style.opacity = '0';
    message.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => message.remove(), 500);
  }, 2000);
}

// Interactive project cards - click to trigger portal effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Don't trigger if clicking a link
    if (e.target.tagName === 'A') return;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(0, 217, 255, 0.5), transparent)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.left = e.offsetX + 'px';
    ripple.style.top = e.offsetY + 'px';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    ripple.style.opacity = '1';

    this.style.position = 'relative';
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(20)';
      ripple.style.opacity = '0';
    }, 10);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Parallax effect on mouse move for hero section
document.addEventListener('mousemove', (e) => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

  const shapes = document.querySelectorAll('.geometric-shape');
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5;
    shape.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
  });
});

// Random color shift on section titles
document.querySelectorAll('.section-title').forEach(title => {
  title.addEventListener('mouseenter', function() {
    const randomHue = Math.floor(Math.random() * 360);
    this.style.filter = `hue-rotate(${randomHue}deg)`;
  });

  title.addEventListener('mouseleave', function() {
    this.style.filter = 'none';
  });
});

// Skill card 3D tilt effect
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// Double-click on hero to trigger screen shake
document.querySelector('.hero').addEventListener('dblclick', () => {
  document.body.style.animation = 'shake 0.5s';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Easter egg: type "neon" anywhere on the page
let typedText = '';
document.addEventListener('keypress', (e) => {
  // Ignore if typing in input/textarea
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  typedText += e.key;
  typedText = typedText.slice(-4);

  if (typedText === 'neon') {
    triggerNeonExplosion();
    typedText = '';
  }
});

function triggerNeonExplosion() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 20);
  }

  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100vw';
  flash.style.height = '100vh';
  flash.style.background = 'rgba(0, 217, 255, 0.5)';
  flash.style.zIndex = '99998';
  flash.style.pointerEvents = 'none';
  flash.style.opacity = '1';
  flash.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(flash);

  setTimeout(() => {
    flash.style.opacity = '0';
    setTimeout(() => flash.remove(), 500);
  }, 100);
}

// Add glowing effect to buttons on hover
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.boxShadow = `0 0 40px ${this.classList.contains('btn-primary') ? '#FF006E' : '#00D9FF'}`;
  });

  btn.addEventListener('mouseleave', function() {
    this.style.boxShadow = `0 0 20px ${this.classList.contains('btn-primary') ? 'rgba(255, 0, 110, 0.5)' : 'rgba(0, 217, 255, 0.3)'}`;
  });
});

// Console message for curious developers
console.log('%c🌀 WELCOME TO THE MATRIX 🌀', 'color: #00D9FF; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00D9FF;');
console.log('%cEaster eggs found:', 'color: #FF006E; font-size: 14px;');
console.log('%c- Click the logo 5 times', 'color: #39FF14;');
console.log('%c- Try the Konami code (↑↑↓↓←→←→BA)', 'color: #39FF14;');
console.log('%c- Type "neon" anywhere on the page', 'color: #39FF14;');
console.log('%c- Double-click the hero section', 'color: #39FF14;');
console.log('%c- Click on project cards', 'color: #39FF14;');
