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
// Also call on DOMContentLoaded to ensure it runs early
document.addEventListener('DOMContentLoaded', revealSections);

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

// ===== INTERACTIVE FEATURES & EASTER EGGS =====

// Mouse trail effect with colorful particles
let particles = [];
const colors = ['#60D394', '#AAF683', '#FFD97D', '#FF9B85', '#4ECDC4', '#44A08D', '#F38181', '#95E1D3'];

document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.85) {
    createParticle(e.clientX, e.clientY);
  }
});

function createParticle(x, y) {
  const particle = document.createElement('div');
  const size = Math.random() * 4 + 3;
  const color = colors[Math.floor(Math.random() * colors.length)];

  particle.style.position = 'fixed';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.borderRadius = '50%';
  particle.style.background = color;
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '9998';
  particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
  particle.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.style.opacity = '0';
    particle.style.transform = `translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(0)`;
  }, 10);

  setTimeout(() => {
    particle.remove();
  }, 1200);
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

  body.style.filter = 'hue-rotate(90deg) saturate(1.5) brightness(1.2)';

  const message = document.createElement('div');
  message.textContent = '🎮 MATRIX MODE ACTIVATED 🎮';
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    color: #4FC3F7;
    text-shadow: 0 0 30px #4FC3F7, 0 0 60px #7E57C2;
    z-index: 99999;
    font-weight: 900;
    pointer-events: none;
    animation: pulse 0.5s infinite alternate;
    background: rgba(10, 25, 41, 0.9);
    padding: 2rem 3rem;
    border-radius: 20px;
    border: 3px solid #4FC3F7;
    backdrop-filter: blur(15px);
  `;

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
    '🎨 Art is everywhere 🎨',
    '💎 You are the chosen one 💎',
    '🚀 To infinity and beyond 🚀',
    '🎭 The show must go on 🎭'
  ];

  const message = document.createElement('div');
  message.textContent = messages[Math.floor(Math.random() * messages.length)];
  message.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    font-size: 2rem;
    color: #E91E63;
    text-shadow: 0 0 20px #E91E63, 0 0 40px #7E57C2;
    z-index: 99999;
    font-weight: 900;
    pointer-events: none;
    padding: 2rem;
    background: rgba(10, 25, 41, 0.95);
    border: 3px solid #E91E63;
    border-radius: 20px;
    backdrop-filter: blur(15px);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);

  setTimeout(() => {
    message.style.opacity = '0';
    message.style.transform = 'translate(-50%, -50%) scale(0.5)';
    setTimeout(() => message.remove(), 300);
  }, 2500);
}

// Interactive project cards - click to trigger portal effect
document.querySelectorAll('.project-card, .homelab-card').forEach(card => {
  card.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) return;

    const ripple = document.createElement('div');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(79, 195, 247, 0.6), rgba(126, 87, 194, 0.3), transparent);
      width: 20px;
      height: 20px;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-out;
      opacity: 1;
    `;

    this.style.position = 'relative';
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(25)';
      ripple.style.opacity = '0';
    }, 10);

    setTimeout(() => ripple.remove(), 800);
  });
});

// Parallax effect on mouse move for hero section and floating shapes
document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5);
  const mouseY = (e.clientY / window.innerHeight - 0.5);

  const shapes = document.querySelectorAll('.geometric-shape');
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 15;
    const x = mouseX * speed;
    const y = mouseY * speed;
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });

  // Kinetic typography - hero title responds to mouse
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const titleX = mouseX * 5;
    const titleY = mouseY * 5;
    heroTitle.style.transform = `translate(${titleX}px, ${titleY}px)`;
  }
});

// Interactive background gradient that follows cursor
document.addEventListener('mousemove', (e) => {
  const body = document.body;
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  body.style.setProperty('--mouse-x', `${x}%`);
  body.style.setProperty('--mouse-y', `${y}%`);
});

// Section titles color shift on hover
document.querySelectorAll('.section-title').forEach(title => {
  title.addEventListener('mouseenter', function() {
    const randomHue = Math.floor(Math.random() * 360);
    this.style.filter = `hue-rotate(${randomHue}deg) saturate(1.3)`;
  });

  title.addEventListener('mouseleave', function() {
    this.style.filter = 'none';
  });
});

// Skill cards and homelab cards 3D tilt effect
document.querySelectorAll('.skill-card, .homelab-card, .blog-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    this.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// Double-click on hero to trigger screen shake
document.querySelector('.hero')?.addEventListener('dblclick', () => {
  document.body.style.animation = 'shake 0.5s';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
});

// Easter egg: type "glass" anywhere on the page to toggle glassmorphism intensity
let typedText = '';
document.addEventListener('keypress', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  typedText += e.key;
  typedText = typedText.slice(-5);

  if (typedText === 'neon') {
    triggerNeonExplosion();
    typedText = '';
  } else if (typedText === 'glass') {
    toggleGlassmorphism();
    typedText = '';
  }
});

function triggerNeonExplosion() {
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 15);
  }

  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle, rgba(79, 195, 247, 0.6), rgba(126, 87, 194, 0.3));
    z-index: 99998;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.5s ease;
  `;

  document.body.appendChild(flash);

  setTimeout(() => {
    flash.style.opacity = '0';
    setTimeout(() => flash.remove(), 500);
  }, 100);
}

let glassIntensity = false;
function toggleGlassmorphism() {
  glassIntensity = !glassIntensity;

  const cards = document.querySelectorAll('.skill-card, .project-card, .homelab-card, .blog-card, .contact-form');
  cards.forEach(card => {
    if (glassIntensity) {
      card.style.backdropFilter = 'blur(25px) saturate(180%)';
      card.style.background = 'rgba(255, 255, 255, 0.08)';
      card.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    } else {
      card.style.backdropFilter = 'blur(10px)';
      card.style.background = '';
      card.style.border = '';
    }
  });

  const message = document.createElement('div');
  message.textContent = glassIntensity ? '✨ ENHANCED GLASS MODE ✨' : '💎 NORMAL MODE 💎';
  message.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    font-size: 1.2rem;
    color: #4FC3F7;
    text-shadow: 0 0 15px #4FC3F7;
    z-index: 99999;
    font-weight: 700;
    pointer-events: none;
    padding: 1rem 2rem;
    background: rgba(10, 25, 41, 0.95);
    border: 2px solid #4FC3F7;
    border-radius: 15px;
    backdrop-filter: blur(15px);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.transform = 'translateY(0)';
    message.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    message.style.opacity = '0';
    message.style.transform = 'translateY(100px)';
    setTimeout(() => message.remove(), 400);
  }, 2000);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }

  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    100% { transform: translate(-50%, -50%) scale(1.05); }
  }
`;
document.head.appendChild(style);

// ===== ADVANCED WEBGL FLUID SIMULATION =====

const canvas = document.getElementById('liquid-canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
  console.warn('WebGL not supported, falling back to canvas');
  // Fallback to simple canvas if WebGL not available
}

let width, height;
let particles = [];
let mouseX = 0, mouseY = 0;
let time = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  if (gl) {
    gl.viewport(0, 0, width, height);
  }
}

// Particle system for fluid effect
class FluidParticle {
  constructor() {
    this.reset();
    this.life = Math.random(); // Start at random life stage
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.size = Math.random() * 100 + 50;
    this.hue = Math.random() * 60 + 200;
    this.life = 1;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update(mouseX, mouseY) {
    // Mouse attraction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 300) {
      const force = (300 - dist) / 300;
      this.vx += (dx / dist) * force * 0.5;
      this.vy += (dy / dist) * force * 0.5;
    }

    // Add some fluid motion
    this.vx += (Math.random() - 0.5) * 0.5;
    this.vy += (Math.random() - 0.5) * 0.5;

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Damping
    this.vx *= 0.95;
    this.vy *= 0.95;

    // Wrap around edges
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;

    // Pulsing effect
    this.life += 0.005;
    this.size = (Math.sin(this.life) * 0.3 + 1) * (Math.random() * 50 + 75);
  }

  draw(ctx) {
    const pulse = Math.sin(this.life * 2) * 0.2 + 0.8;
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * pulse
    );

    gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, ${this.opacity * pulse})`);
    gradient.addColorStop(0.4, `hsla(${this.hue + 30}, 75%, 60%, ${this.opacity * 0.6})`);
    gradient.addColorStop(1, `hsla(${this.hue}, 70%, 50%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
function initFluid() {
  particles = [];
  const count = Math.min(20, Math.floor(width * height / 50000)); // Adaptive count
  for (let i = 0; i < count; i++) {
    particles.push(new FluidParticle());
  }
}

// Animation loop
function animateFluid() {
  const ctx = canvas.getContext('2d');

  // Fade effect for trails
  ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // Strong blur for fluid effect
  ctx.filter = 'blur(60px)';

  // Update and draw particles
  time += 0.01;
  particles.forEach((particle, i) => {
    // Add some flow field influence
    const flowX = Math.sin(particle.x * 0.01 + time) * 0.5;
    const flowY = Math.cos(particle.y * 0.01 + time) * 0.5;
    particle.vx += flowX;
    particle.vy += flowY;

    particle.update(mouseX, mouseY);
    particle.draw(ctx);
  });

  ctx.filter = 'none';

  // Add some glow overlay
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'blur(40px)';
  particles.forEach(particle => {
    const glowGradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 0.5
    );
    glowGradient.addColorStop(0, `hsla(${particle.hue}, 90%, 75%, 0.1)`);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'none';

  requestAnimationFrame(animateFluid);
}

// Track mouse for fluid attraction
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Initialize
resizeCanvas();
initFluid();
animateFluid();

window.addEventListener('resize', () => {
  resizeCanvas();
  initFluid();
});

// ===== MAGNETIC MORPHING CURSOR =====

let cursor = null; // Will be set after DOM loads
let cursorX = 0, cursorY = 0;
let currentX = 0, currentY = 0;
let targetElement = null;
let isMagnetic = false;

// Track all interactive elements
const magneticElements = [];

function initMagneticElements() {
  const selectors = 'a, button, .project-card, .skill-card, .blog-card, .homelab-card, .nav-link, .btn';
  document.querySelectorAll(selectors).forEach(el => {
    magneticElements.push({
      element: el,
      rect: el.getBoundingClientRect()
    });

    // Grow cursor on hover
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '120px';
      cursor.style.height = '120px';
      cursor.querySelector('.cursor-inner').style.background = `radial-gradient(circle,
        rgba(192, 132, 252, 0.9) 0%,
        rgba(232, 121, 249, 0.7) 40%,
        transparent 70%)`;
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.querySelector('.cursor-inner').style.background = `radial-gradient(circle,
        rgba(138, 180, 248, 0.8) 0%,
        rgba(167, 139, 250, 0.6) 40%,
        transparent 70%)`;
    });
  });
}

// Update magnetic element positions on scroll/resize
function updateMagneticPositions() {
  magneticElements.forEach(item => {
    item.rect = item.element.getBoundingClientRect();
  });
}

window.addEventListener('scroll', updateMagneticPositions);
window.addEventListener('resize', () => {
  updateMagneticPositions();
  initMagneticElements();
});

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  // Check for magnetic attraction
  let closestDistance = Infinity;
  let closestElement = null;

  magneticElements.forEach(item => {
    const rect = item.rect;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = cursorX - centerX;
    const dy = cursorY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const magneticRadius = Math.max(rect.width, rect.height) * 0.8;

    if (distance < magneticRadius && distance < closestDistance) {
      closestDistance = distance;
      closestElement = { centerX, centerY, distance, magneticRadius };
    }
  });

  if (closestElement) {
    isMagnetic = true;
    const strength = 1 - (closestElement.distance / closestElement.magneticRadius);
    const pullX = (closestElement.centerX - cursorX) * strength * 0.3;
    const pullY = (closestElement.centerY - cursorY) * strength * 0.3;

    cursorX += pullX;
    cursorY += pullY;
  } else {
    isMagnetic = false;
  }
});

function animateCursor() {
  if (!cursor) return; // Safety check

  // Smooth magnetic follow
  const smoothing = isMagnetic ? 0.2 : 0.15;
  currentX += (cursorX - currentX) * smoothing;
  currentY += (cursorY - currentY) * smoothing;

  cursor.style.left = currentX - 30 + 'px';
  cursor.style.top = currentY - 30 + 'px';

  requestAnimationFrame(animateCursor);
}

// Initialize after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  cursor = document.querySelector('.custom-cursor');

  if (!cursor) {
    console.error('Cursor element not found in DOM!');
    return;
  }

  console.log('Cursor element found:', cursor);
  initMagneticElements();
  animateCursor();
});

// ===== KINETIC SPLIT-TEXT TYPOGRAPHY =====

function splitText(element) {
  const text = element.textContent;
  element.innerHTML = '';

  const words = text.split(' ');
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';

    word.split('').forEach((char, charIndex) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.textContent = char;
      charSpan.style.setProperty('--char-index', charIndex);
      wordSpan.appendChild(charSpan);
    });

    element.appendChild(wordSpan);
    if (wordIndex < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });
}

// Apply to hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  splitText(heroTitle);

  // Kinetic typography - follows mouse
  let titleMouseX = 0, titleMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    titleMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    titleMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateHeroText() {
    const chars = heroTitle.querySelectorAll('.char');
    chars.forEach((char, index) => {
      const offsetX = titleMouseX * (10 + index * 0.5);
      const offsetY = titleMouseY * (10 + index * 0.5);
      const delay = index * 0.02;

      char.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${titleMouseX * 2}deg)`;
      char.style.transitionDelay = `${delay}s`;
    });

    requestAnimationFrame(animateHeroText);
  }

  animateHeroText();
}

// ===== SCROLL-VELOCITY ANIMATIONS =====

let lastScrollY = window.scrollY;
let scrollVelocity = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  scrollVelocity = currentScrollY - lastScrollY;
  lastScrollY = currentScrollY;

  // Apply to section titles
  document.querySelectorAll('.section-title').forEach(title => {
    const speed = scrollVelocity * 0.5;
    title.style.transform = `translateX(${speed}px)`;
  });

  // Slow decay
  setTimeout(() => {
    scrollVelocity *= 0.95;
  }, 50);
});

// ===== 3D CARD TILT EFFECTS =====

function init3DCards() {
  const cards = document.querySelectorAll('.skill-card, .homelab-card, .blog-card');

  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.1s ease-out';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });

  // Bento items get simpler 3D effect
  const bentoItems = document.querySelectorAll('.bento-item');
  bentoItems.forEach(item => {
    item.style.transformStyle = 'preserve-3d';
    item.style.transition = 'transform 0.1s ease-out';

    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// Initialize after DOM loaded
setTimeout(init3DCards, 200);

// ===== PARTICLE TEXT REVEAL =====

function createParticleText(element) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  element.style.position = 'relative';
  element.appendChild(canvas);

  const rect = element.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';

  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.fillStyle = `rgba(138, 180, 248, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// Apply to section titles on scroll into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.particlesAdded) {
      createParticleText(entry.target);
      entry.target.dataset.particlesAdded = 'true';
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title').forEach(title => {
  observer.observe(title);
});

// ===== SCROLL-TRIGGERED MICRO-INTERACTIONS =====

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Observe all cards (sections handled by revealSections function)
document.querySelectorAll('.skill-card, .homelab-card, .blog-card, .bento-item').forEach(el => {
  scrollObserver.observe(el);
});

// Console message for curious developers
console.log('%c💧 WELCOME TO THE LIQUID DIMENSION 💧', 'color: #8AB4F8; font-size: 24px; font-weight: bold; text-shadow: 0 0 15px #8AB4F8;');
console.log('%c✨ Interactive Features:', 'color: #A78BFA; font-size: 16px; font-weight: bold;');
console.log('%c  🌊 Morphing liquid blobs in background', 'color: #8AB4F8; font-size: 13px;');
console.log('%c  🖱️  Custom morphing cursor that follows you', 'color: #8AB4F8; font-size: 13px;');
console.log('%c  ✨ Mouse trail particles everywhere', 'color: #A78BFA; font-size: 13px;');
console.log('%c  👆 Click the logo 5 times', 'color: #C084FC; font-size: 13px;');
console.log('%c  ⌨️  Try the Konami code (↑↑↓↓←→←→BA)', 'color: #C084FC; font-size: 13px;');
console.log('%c  💬 Type "neon" anywhere for explosion', 'color: #E879F9; font-size: 13px;');
console.log('%c  🪟 Type "glass" to toggle glassmorphism', 'color: #E879F9; font-size: 13px;');
console.log('%c  👋 Double-click the hero section to shake', 'color: #8AB4F8; font-size: 13px;');
console.log('%c  🎯 Click on cards for ripple effects', 'color: #A78BFA; font-size: 13px;');
console.log('%c  🎨 Hover over section titles for color magic', 'color: #C084FC; font-size: 13px;');
console.log('%c  🎪 3D tilt on cards when you hover', 'color: #E879F9; font-size: 13px;');
console.log('%c\n💎 Flowing smoothly through the digital universe', 'color: #A78BFA; font-size: 12px; font-style: italic;');
