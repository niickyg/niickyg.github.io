// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Detect reduced motion preference for accessibility
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== THEME MANAGER (2025) =====
class ThemeManager {
  constructor() {
    this.theme = this.getInitialTheme();
    this.toggleButton = null;
    this.themeIcon = null;
    this.init();
  }

  getInitialTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  init() {
    // Apply initial theme immediately to prevent flash
    this.applyTheme();

    // Wait for DOM to be ready before setting up button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupToggle());
    } else {
      this.setupToggle();
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if user hasn't set a manual preference
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  setupToggle() {
    this.toggleButton = document.getElementById('theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');

    if (this.toggleButton) {
      this.updateIcon();
      this.toggleButton.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateIcon();

    // Update meta theme-color for mobile browsers
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = this.theme === 'dark' ? '#0A1929' : '#f5f5f7';
  }

  updateIcon() {
    if (this.themeIcon) {
      // Moon icon for dark theme (click to go light)
      // Sun icon for light theme (click to go dark)
      const iconClass = this.theme === 'dark' ? 'fa-sun' : 'fa-moon';
      this.themeIcon.className = `fas ${iconClass}`;
    }
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

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

// Only enable mouse trail if reduced motion is not preferred
if (!prefersReducedMotion) {
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) {
      createParticle(e.clientX, e.clientY);
    }
  });
}

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

// ===== ADVANCED FLUID SIMULATION =====

const canvas = document.getElementById('liquid-canvas');

let width, height;
let fluidParticles = [];
let mouseX = 0, mouseY = 0;
let time = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
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
  fluidParticles = [];
  const count = Math.min(20, Math.floor(width * height / 50000)); // Adaptive count
  for (let i = 0; i < count; i++) {
    fluidParticles.push(new FluidParticle());
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
  fluidParticles.forEach((particle, i) => {
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
  fluidParticles.forEach(particle => {
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

// ===== INTERACTIVE SKILL ECOSYSTEM TERRARIUM =====

// Spore particles for organic effects
class Spore {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * -2 - 1;
    this.size = Math.random() * 3 + 1;
    this.color = color;
    this.life = 1;
    this.decay = 0.01 + Math.random() * 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravity
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.globalAlpha = this.life * 0.6;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Plant class - each skill becomes a unique plant
class Plant {
  constructor(x, y, skill, color, type) {
    this.baseX = x;
    this.baseY = y;
    this.skill = skill;
    this.color = color;
    this.type = type; // 'tree', 'flower', 'succulent', 'fern', 'moss'
    this.isHovered = false;
    this.growthPhase = 0;
    this.maxGrowth = 1;
    this.swayPhase = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.02 + Math.random() * 0.01;
    this.swayAmount = 2 + Math.random() * 3;
  }

  update(mouseX, mouseY, spores) {
    // Gentle swaying motion
    this.swayPhase += this.swaySpeed;

    // Check if mouse is hovering
    const dx = mouseX - this.baseX;
    const dy = mouseY - this.baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const wasHovered = this.isHovered;
    this.isHovered = distance < 60;

    // Grow when hovered
    if (this.isHovered) {
      this.maxGrowth = Math.min(1.3, this.maxGrowth + 0.02);

      // Release spores occasionally
      if (Math.random() < 0.1) {
        const sporeX = this.baseX + (Math.random() - 0.5) * 40;
        const sporeY = this.baseY - 50 - Math.random() * 30;
        spores.push(new Spore(sporeX, sporeY, this.color));
      }
    } else {
      this.maxGrowth = Math.max(1, this.maxGrowth - 0.01);
    }

    // Smooth growth animation
    this.growthPhase += (this.maxGrowth - this.growthPhase) * 0.1;
  }

  draw(ctx) {
    const sway = Math.sin(this.swayPhase) * this.swayAmount;

    ctx.save();
    ctx.translate(this.baseX, this.baseY);

    switch(this.type) {
      case 'tree':
        this.drawTree(ctx, sway);
        break;
      case 'flower':
        this.drawFlower(ctx, sway);
        break;
      case 'succulent':
        this.drawSucculent(ctx, sway);
        break;
      case 'fern':
        this.drawFern(ctx, sway);
        break;
      case 'moss':
        this.drawMoss(ctx, sway);
        break;
    }

    // Draw label when hovered
    if (this.isHovered) {
      ctx.fillStyle = 'rgba(10, 25, 41, 0.9)';
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;

      const labelWidth = 120;
      const labelHeight = 30;
      const labelX = -labelWidth / 2;
      const labelY = -120;

      ctx.beginPath();
      ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.skill, 0, labelY + labelHeight / 2);
    }

    ctx.restore();
  }

  drawTree(ctx, sway) {
    const height = 80 * this.growthPhase;

    // Trunk
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(-4 + sway * 0.3, -height, 8, height);

    // Canopy - branching effect
    const canopySize = 35 * this.growthPhase;
    for (let i = 0; i < 3; i++) {
      const y = -height + i * 15;
      const size = canopySize - i * 8;
      const gradient = ctx.createRadialGradient(sway * 0.7, y, 0, sway * 0.7, y, size);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, `${this.color}66`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sway * 0.7, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFlower(ctx, sway) {
    const stemHeight = 70 * this.growthPhase;

    // Stem
    ctx.strokeStyle = '#7CB342';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(sway, -stemHeight / 2, sway * 1.5, -stemHeight);
    ctx.stroke();

    // Flower petals
    const petalCount = 6;
    const petalSize = 15 * this.growthPhase;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalX = sway * 1.5 + Math.cos(angle) * petalSize;
      const petalY = -stemHeight + Math.sin(angle) * petalSize;

      const gradient = ctx.createRadialGradient(sway * 1.5, -stemHeight, 0, petalX, petalY, petalSize);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, `${this.color}33`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(petalX, petalY, petalSize, petalSize * 1.5, angle, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center
    ctx.fillStyle = '#FFD97D';
    ctx.beginPath();
    ctx.arc(sway * 1.5, -stemHeight, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSucculent(ctx, sway) {
    const size = 40 * this.growthPhase;
    const layers = 5;

    for (let i = layers - 1; i >= 0; i--) {
      const layerSize = size * (1 - i * 0.15);
      const y = -i * 8;

      // Geometric succulent leaves
      const points = 8;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (let j = 0; j < points; j++) {
        const angle = (j / points) * Math.PI * 2;
        const r = layerSize * (j % 2 === 0 ? 1 : 0.7);
        const x = sway * 0.2 + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (j === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.closePath();
      ctx.fill();

      // Border
      ctx.strokeStyle = `${this.color}DD`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawFern(ctx, sway) {
    const frondCount = 6;
    const frondLength = 50 * this.growthPhase;

    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2 - Math.PI / 2;
      const baseAngle = angle;

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Curved frond
      const segments = 8;
      for (let j = 1; j <= segments; j++) {
        const t = j / segments;
        const r = frondLength * t;
        const currentAngle = baseAngle + sway * 0.05 * Math.sin(t * Math.PI);
        const x = Math.cos(currentAngle) * r;
        const y = Math.sin(currentAngle) * r - 10;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Leaflets
      for (let j = 1; j <= segments; j++) {
        const t = j / segments;
        const r = frondLength * t;
        const currentAngle = baseAngle + sway * 0.05 * Math.sin(t * Math.PI);
        const x = Math.cos(currentAngle) * r;
        const y = Math.sin(currentAngle) * r - 10;

        const leafletSize = 8 * (1 - t);
        ctx.fillStyle = `${this.color}AA`;
        ctx.beginPath();
        ctx.ellipse(x, y, leafletSize, leafletSize * 0.5, currentAngle + Math.PI / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawMoss(ctx, sway) {
    const puffCount = 12;
    const spread = 35 * this.growthPhase;

    for (let i = 0; i < puffCount; i++) {
      const angle = (i / puffCount) * Math.PI * 2;
      const distance = (Math.random() * 0.5 + 0.5) * spread;
      const x = Math.cos(angle) * distance + sway * 0.1;
      const y = Math.sin(angle) * distance * 0.5 - 5;
      const size = 8 + Math.random() * 6;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, `${this.color}44`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * this.growthPhase, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

class SkillEcosystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Ecosystem canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.plants = [];
    this.spores = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.resize();
    this.init();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  init() {
    const skills = [
      { name: 'Entrepreneurship', color: '#60D394', type: 'tree' },
      { name: 'Leadership', color: '#4ECDC4', type: 'flower' },
      { name: 'Sustainability', color: '#AAF683', type: 'moss' },
      { name: 'Innovation', color: '#FFD97D', type: 'flower' },
      { name: 'Strategy', color: '#FF9B85', type: 'succulent' }
    ];

    // Position plants across the terrarium floor
    const groundLevel = this.canvas.height - 80;
    const spacing = this.canvas.width / (skills.length + 1);

    skills.forEach((skill, index) => {
      const x = spacing * (index + 1);
      const y = groundLevel;
      const plant = new Plant(x, y, skill.name, skill.color, skill.type);
      this.plants.push(plant);
    });
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });

    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
  }

  animate() {
    // Clear with subtle background
    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    bgGradient.addColorStop(0, 'rgba(96, 211, 148, 0.02)');
    bgGradient.addColorStop(1, 'rgba(78, 205, 196, 0.05)');
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw spores
    this.spores = this.spores.filter(spore => {
      spore.update();
      spore.draw(this.ctx);
      return spore.life > 0;
    });

    // Update and draw plants
    this.plants.forEach(plant => {
      plant.update(this.mouseX, this.mouseY, this.spores);
      plant.draw(this.ctx);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize ecosystem when DOM is ready and fonts are loaded
function initEcosystem() {
  const canvas = document.getElementById('skillEcosystem');
  if (canvas && !canvas.dataset.initialized) {
    console.log('Canvas found, creating ecosystem');
    try {
      new SkillEcosystem('skillEcosystem');
      canvas.dataset.initialized = 'true';
      console.log('Ecosystem initialized successfully!');
    } catch (error) {
      console.error('Error initializing ecosystem:', error);
    }
  } else if (!canvas) {
    console.error('Canvas element #skillEcosystem not found!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, waiting for fonts...');

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      console.log('Fonts loaded, initializing ecosystem...');
      setTimeout(initEcosystem, 100);
    }).catch(error => {
      console.warn('Font loading error, initializing anyway:', error);
      setTimeout(initEcosystem, 100);
    });
  } else {
    console.log('Font Loading API not supported, initializing with delay...');
    setTimeout(initEcosystem, 500);
  }
});

// Backup initialization after full page load
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!document.getElementById('skillEcosystem')?.dataset?.initialized) {
      console.log('Backup initialization...');
      initEcosystem();
    }
  }, 200);
});


// ===== MAGNETIC BUTTON EFFECTS (2025) =====
class MagneticButton {
  constructor(element) {
    this.element = element;
    this.strength = 0.3; // How strongly the button pulls toward cursor
    this.maxDistance = 50; // Maximum distance for magnetic effect

    this.boundOnMouseMove = (e) => this.onMouseMove(e);
    this.boundOnMouseLeave = () => this.onMouseLeave();

    element.addEventListener('mouseenter', () => this.enable());
    element.addEventListener('mouseleave', () => this.disable());
  }

  enable() {
    this.element.addEventListener('mousemove', this.boundOnMouseMove);
    this.element.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  disable() {
    this.element.removeEventListener('mousemove', this.boundOnMouseMove);
    this.onMouseLeave();
  }

  onMouseMove(e) {
    if (prefersReducedMotion) return;

    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(rect.width, rect.height);

    // Calculate strength based on distance from center
    const strength = Math.min(1, (maxDistance - distance) / maxDistance);

    const translateX = deltaX * this.strength * strength;
    const translateY = deltaY * this.strength * strength;

    this.element.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
  }

  onMouseLeave() {
    this.element.style.transform = 'translate(0, 0) scale(1)';
  }
}

// Apply magnetic effect to buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn, .skill-card, .project-card, .homelab-card, .nav-link');

  if (!prefersReducedMotion) {
    buttons.forEach(button => {
      new MagneticButton(button);
    });
  }
});

// ===== VIEW TRANSITIONS API (2025) =====
// Smooth page-like transitions when navigating between sections
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', async function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Check if View Transitions API is supported
      if (!prefersReducedMotion && document.startViewTransition) {
        // Use View Transitions API for smooth morphing effect
        document.startViewTransition(async () => {
          target.scrollIntoView({
            behavior: 'instant',
            block: 'start'
          });

          // Update active section
          document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
          target.classList.add('active');

          // Update active nav link
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        });
      } else {
        // Fallback for unsupported browsers or reduced motion
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });

        // Update active states
        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        target.classList.add('active');
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
});

// Console message for curious developers
console.log('%c💧 WELCOME TO THE LIQUID DIMENSION 💧', 'color: #8AB4F8; font-size: 24px; font-weight: bold; text-shadow: 0 0 15px #8AB4F8;');
console.log('%c✨ Interactive Features:', 'color: #A78BFA; font-size: 16px; font-weight: bold;');
console.log('%c  🌊 Morphing liquid blobs in background', 'color: #8AB4F8; font-size: 13px;');
console.log('%c  ⭐ Interactive Skill Constellation Network', 'color: #60D394; font-size: 14px; font-weight: bold;');
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
