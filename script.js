// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Detect reduced motion preference for accessibility
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== ENHANCED EFFECTS FLAG =====
// Set to false to disable heavy visual effects (custom cursor, particle trails, liquid canvas, morphing blobs)
const ENHANCED_EFFECTS = false;

// ===== SPLASH SCREEN HANDLER =====
class SplashScreen {
  constructor() {
    this.splashScreen = document.getElementById('splash-screen');
    this.mainContent = document.getElementById('main-content');
    this.enterBtn = document.getElementById('splash-enter-btn');
    this.sessionKey = 'splashDismissed';

    this.init();
  }

  init() {
    // Check if splash was already dismissed this session
    if (sessionStorage.getItem(this.sessionKey)) {
      this.skipSplash();
      return;
    }

    // Show splash and set up listeners
    this.showSplash();
    this.setupListeners();
  }

  showSplash() {
    if (this.splashScreen) {
      this.splashScreen.classList.remove('hidden');
    }
    if (this.mainContent) {
      this.mainContent.classList.add('hidden');
    }
  }

  skipSplash() {
    // Immediately hide splash and show content (no animation)
    if (this.splashScreen) {
      this.splashScreen.style.display = 'none';
      this.splashScreen.classList.add('hidden');
    }
    if (this.mainContent) {
      this.mainContent.classList.remove('hidden');
    }
  }

  setupListeners() {
    // Click button to enter
    if (this.enterBtn) {
      this.enterBtn.addEventListener('click', () => this.dismissSplash());
    }

    // Press Enter or Space to enter
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !this.splashScreen.classList.contains('hidden')) {
        e.preventDefault();
        this.dismissSplash();
      }
    });

    // Click anywhere on splash to enter
    if (this.splashScreen) {
      this.splashScreen.addEventListener('click', (e) => {
        if (e.target === this.splashScreen || e.target.closest('.splash-content')) {
          this.dismissSplash();
        }
      });
    }
  }

  dismissSplash() {
    // Store in session so it doesn't show again during this visit
    sessionStorage.setItem(this.sessionKey, 'true');

    // Animate out
    if (this.splashScreen) {
      this.splashScreen.classList.add('hidden');
    }

    // Show main content after splash fades (500ms matches CSS transition)
    setTimeout(() => {
      if (this.mainContent) {
        this.mainContent.classList.remove('hidden');
      }
      // Trigger scroll reveal for visible sections
      if (typeof revealSections === 'function') {
        revealSections();
      }
    }, 500);
  }
}

// Initialize splash screen
const splashScreen = new SplashScreen();

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
    metaTheme.content = this.theme === 'dark' ? '#1a1a1a' : '#FDF8F3';
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
  if (!navbar) return;
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

if (hamburger && navMenu) {
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
}

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
if (blogModalClose && blogModal) {
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
  if (blogModal && e.key === 'Escape' && blogModal.style.display === 'block') {
    blogModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ===== INTERACTIVE FEATURES & EASTER EGGS =====

// Mouse trail effect with colorful particles - Tesoro palette
let particles = [];
const colors = ['#00D26A', '#4AE88C', '#7C3AED', '#A78BFA', '#00A855', '#5B21B6', '#F59E0B', '#EF4444'];

// Only enable mouse trail if reduced motion is not preferred AND enhanced effects are on
if (!prefersReducedMotion && ENHANCED_EFFECTS) {
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
    color: #00D26A;
    text-shadow: 0 0 30px rgba(0, 210, 106, 0.8), 0 0 60px rgba(124, 58, 237, 0.6);
    z-index: 99999;
    font-weight: 900;
    pointer-events: none;
    animation: pulse 0.5s infinite alternate;
    background: rgba(26, 26, 26, 0.95);
    padding: 2rem 3rem;
    border-radius: 20px;
    border: 3px solid #00D26A;
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

if (navLogo) {
  navLogo.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;

    if (logoClicks === 5) {
      showSecretMessage();
      logoClicks = 0;
    }
  });
}

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
    color: #7C3AED;
    text-shadow: 0 0 20px rgba(124, 58, 237, 0.8), 0 0 40px rgba(0, 210, 106, 0.6);
    z-index: 99999;
    font-weight: 900;
    pointer-events: none;
    padding: 2rem;
    background: rgba(26, 26, 26, 0.95);
    border: 3px solid #7C3AED;
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
      background: radial-gradient(circle, rgba(0, 210, 106, 0.6), rgba(124, 58, 237, 0.3), transparent);
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
    background: radial-gradient(circle, rgba(0, 210, 106, 0.6), rgba(124, 58, 237, 0.3));
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
    color: #00D26A;
    text-shadow: 0 0 15px rgba(0, 210, 106, 0.8);
    z-index: 99999;
    font-weight: 700;
    pointer-events: none;
    padding: 1rem 2rem;
    background: rgba(26, 26, 26, 0.95);
    border: 2px solid #00D26A;
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
// Only runs when ENHANCED_EFFECTS is true

const canvas = document.getElementById('liquid-canvas');

let width, height;
let fluidParticles = [];
let mouseX = 0, mouseY = 0;
let time = 0;

function resizeCanvas() {
  if (!canvas) return;
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
  if (!canvas || !ENHANCED_EFFECTS) return;
  fluidParticles = [];
  const count = Math.min(20, Math.floor(width * height / 50000)); // Adaptive count
  for (let i = 0; i < count; i++) {
    fluidParticles.push(new FluidParticle());
  }
}

// Animation loop
function animateFluid() {
  if (!canvas || !ENHANCED_EFFECTS) return;
  const ctx = canvas.getContext('2d');

  // Fade effect for trails - Tesoro dark base
  ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
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

// Initialize fluid simulation only if canvas exists and enhanced effects are enabled
if (canvas && ENHANCED_EFFECTS) {
  resizeCanvas();
  initFluid();
  animateFluid();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initFluid();
  });
}

// ===== MAGNETIC MORPHING CURSOR =====
// Only runs when ENHANCED_EFFECTS is true

let cursor = null; // Will be set after DOM loads
let cursorX = 0, cursorY = 0;
let currentX = 0, currentY = 0;
let targetElement = null;
let isMagnetic = false;

// Track all interactive elements
const magneticElements = [];

// Declare functions at module level (will be replaced if enhanced effects are on)
let initMagneticElements = function() {};
let updateMagneticPositions = function() {};
let animateCursor = function() {};

function initMagneticElementsReal() {
  if (!ENHANCED_EFFECTS || !cursor) return;

  const selectors = 'a, button, .project-card, .skill-card, .blog-card, .homelab-card, .nav-link, .btn';
  document.querySelectorAll(selectors).forEach(el => {
    magneticElements.push({
      element: el,
      rect: el.getBoundingClientRect()
    });

    // Grow cursor on hover - Tesoro colors
    el.addEventListener('mouseenter', () => {
      if (!cursor) return;
      cursor.style.width = '120px';
      cursor.style.height = '120px';
      const cursorInner = cursor.querySelector('.cursor-inner');
      if (cursorInner) {
        cursorInner.style.background = `radial-gradient(circle,
          rgba(124, 58, 237, 0.9) 0%,
          rgba(167, 139, 250, 0.7) 40%,
          transparent 70%)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (!cursor) return;
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      const cursorInner = cursor.querySelector('.cursor-inner');
      if (cursorInner) {
        cursorInner.style.background = `radial-gradient(circle,
          rgba(0, 210, 106, 0.8) 0%,
          rgba(74, 232, 140, 0.6) 40%,
          transparent 70%)`;
      }
    });
  });
}

// Alias for the real function when enhanced effects are on
if (ENHANCED_EFFECTS) {
  initMagneticElements = initMagneticElementsReal;
}

// Update magnetic element positions on scroll/resize
function updateMagneticPositionsReal() {
  if (!ENHANCED_EFFECTS) return;
  magneticElements.forEach(item => {
    item.rect = item.element.getBoundingClientRect();
  });
}

if (ENHANCED_EFFECTS) {
  updateMagneticPositions = updateMagneticPositionsReal;
  window.addEventListener('scroll', updateMagneticPositions);
  window.addEventListener('resize', () => {
    updateMagneticPositions();
    if (typeof initMagneticElements === 'function') initMagneticElements();
  });
}

if (ENHANCED_EFFECTS) {
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
}

function animateCursorReal() {
  if (!cursor || !ENHANCED_EFFECTS) return; // Safety check

  // Smooth magnetic follow
  const smoothing = isMagnetic ? 0.2 : 0.15;
  currentX += (cursorX - currentX) * smoothing;
  currentY += (cursorY - currentY) * smoothing;

  cursor.style.left = currentX - 30 + 'px';
  cursor.style.top = currentY - 30 + 'px';

  requestAnimationFrame(animateCursorReal);
}

if (ENHANCED_EFFECTS) {
  animateCursor = animateCursorReal;
}

// Initialize custom cursor after DOM loaded (only if enhanced effects enabled)
document.addEventListener('DOMContentLoaded', () => {
  if (!ENHANCED_EFFECTS) return;

  cursor = document.querySelector('.custom-cursor');

  if (!cursor) {
    // Custom cursor element doesn't exist, which is fine when enhanced effects are off
    return;
  }

  if (typeof initMagneticElements === 'function') initMagneticElements();
  if (typeof animateCursor === 'function') animateCursor();
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

      ctx.fillStyle = `rgba(0, 210, 106, ${p.opacity})`;
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

// Console message for curious developers - Tesoro colors
console.log('%c WELCOME TO THE TESORO DIMENSION', 'color: #00D26A; font-size: 24px; font-weight: bold; text-shadow: 0 0 15px rgba(0, 210, 106, 0.8);');
console.log('%c Interactive Features:', 'color: #7C3AED; font-size: 16px; font-weight: bold;');
console.log('%c  Morphing liquid blobs in background', 'color: #00D26A; font-size: 13px;');
console.log('%c  Interactive Skill Constellation Network', 'color: #4AE88C; font-size: 14px; font-weight: bold;');
console.log('%c  Custom morphing cursor that follows you', 'color: #00D26A; font-size: 13px;');
console.log('%c  Mouse trail particles everywhere', 'color: #7C3AED; font-size: 13px;');
console.log('%c  Click the logo 5 times', 'color: #A78BFA; font-size: 13px;');
console.log('%c  Try the Konami code (upupdowndownleftrightleftrightBA)', 'color: #A78BFA; font-size: 13px;');
console.log('%c  Type "neon" anywhere for explosion', 'color: #5B21B6; font-size: 13px;');
console.log('%c  Type "glass" to toggle glassmorphism', 'color: #5B21B6; font-size: 13px;');
console.log('%c  Double-click the hero section to shake', 'color: #00D26A; font-size: 13px;');
console.log('%c  Click on cards for ripple effects', 'color: #7C3AED; font-size: 13px;');
console.log('%c  Hover over section titles for color magic', 'color: #A78BFA; font-size: 13px;');
console.log('%c  3D tilt on cards when you hover', 'color: #5B21B6; font-size: 13px;');
console.log('%c  Physics-based floating tech icons', 'color: #4AE88C; font-size: 13px;');
console.log('%c  Geometric clip-path project cards', 'color: #00A855; font-size: 13px;');
console.log('%c\n Flowing smoothly through the Tesoro universe', 'color: #7C3AED; font-size: 12px; font-style: italic;');


// ===== TESORO-INSPIRED 2025 FEATURES =====

// ===== 1. GSAP CHARACTER-LEVEL TEXT ANIMATIONS =====
class CharacterAnimator {
  constructor() {
    this.init();
  }

  init() {
    // Only initialize if GSAP is available and reduced motion is not preferred
    if (typeof gsap === 'undefined' || prefersReducedMotion) {
      return;
    }

    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.animateHeroTitle();
    this.animateSectionTitles();
  }

  // Split text into characters with proper word wrapping
  splitIntoChars(element) {
    const text = element.textContent;
    element.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      word.split('').forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char split-char';
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.setProperty('--char-index', charIndex);
        wordSpan.appendChild(charSpan);
      });

      element.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        element.appendChild(space);
      }
    });

    return element.querySelectorAll('.char');
  }

  animateHeroTitle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const chars = this.splitIntoChars(heroTitle);

    // Initial animation on page load
    gsap.fromTo(chars,
      {
        opacity: 0,
        y: 50,
        rotationX: -90,
        transformOrigin: 'center bottom'
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: {
          amount: 0.8,
          from: 'start'
        },
        delay: 0.3
      }
    );

    // Add hover color wave effect
    chars.forEach((char, index) => {
      char.addEventListener('mouseenter', () => {
        // Animate this char and neighbors
        const neighbors = [
          chars[index - 2],
          chars[index - 1],
          char,
          chars[index + 1],
          chars[index + 2]
        ].filter(Boolean);

        neighbors.forEach((neighbor, i) => {
          const delay = Math.abs(i - 2) * 0.05;
          gsap.to(neighbor, {
            color: '#00D26A',
            textShadow: '0 0 20px rgba(0, 210, 106, 0.8)',
            duration: 0.3,
            delay: delay,
            ease: 'power2.out'
          });

          gsap.to(neighbor, {
            color: '',
            textShadow: '',
            duration: 0.5,
            delay: delay + 0.3,
            ease: 'power2.out'
          });
        });
      });
    });
  }

  animateSectionTitles() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
      const chars = this.splitIntoChars(title);

      // Create scroll-triggered animation
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: title,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            title.classList.add('in-view');
            gsap.fromTo(chars,
              {
                opacity: 0,
                y: 30,
                rotationY: -20
              },
              {
                opacity: 1,
                y: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.02
              }
            );
          }
        });
      }
    });
  }
}

// ===== 2. MATTER.JS PHYSICS FLOATING TECH ICONS =====
class PhysicsIcons {
  constructor() {
    this.canvas = document.getElementById('physics-canvas');
    if (!this.canvas || prefersReducedMotion || typeof Matter === 'undefined') {
      return;
    }

    this.init();
  }

  init() {
    const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

    // Create engine
    this.engine = Engine.create({
      gravity: { x: 0, y: 0.3 } // Subtle downward gravity
    });

    // Create renderer
    this.render = Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });

    // Tech icons as circular bodies
    this.techIcons = [
      { icon: 'fab fa-react', color: '#61DAFB', label: 'React' },
      { icon: 'fab fa-node-js', color: '#339933', label: 'Node.js' },
      { icon: 'fab fa-python', color: '#3776AB', label: 'Python' },
      { icon: 'fab fa-docker', color: '#2496ED', label: 'Docker' },
      { icon: 'fab fa-git-alt', color: '#F05032', label: 'Git' },
      { icon: 'fab fa-js', color: '#F7DF1E', label: 'JavaScript' },
      { icon: 'fas fa-database', color: '#4ECDC4', label: 'Database' },
      { icon: 'fas fa-cloud', color: '#60D394', label: 'Cloud' },
      { icon: 'fas fa-code', color: '#AAF683', label: 'Code' },
      { icon: 'fas fa-terminal', color: '#FFD97D', label: 'Terminal' }
    ];

    this.bodies = [];
    this.createBodies(Bodies, Body, Composite);
    this.setupMouseInteraction(Mouse, MouseConstraint, Composite);
    this.createWalls(Bodies, Composite);

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, this.engine);
    Render.run(this.render);

    // Custom render for icons
    Events.on(this.render, 'afterRender', () => {
      this.drawIcons();
    });

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  createBodies(Bodies, Body, Composite) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    this.techIcons.forEach((tech, index) => {
      const angle = (index / this.techIcons.length) * Math.PI * 2;
      const radius = 150 + Math.random() * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius - 100;

      const body = Bodies.circle(x, y, 30, {
        restitution: 0.75, // Bounce
        friction: 0.1,
        frictionAir: 0.02,
        render: {
          fillStyle: 'transparent',
          strokeStyle: tech.color,
          lineWidth: 2
        },
        label: tech.label,
        techData: tech
      });

      // Add initial random velocity
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      });

      this.bodies.push(body);
      Composite.add(this.engine.world, body);
    });
  }

  createWalls(Bodies, Composite) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const thickness = 50;

    const walls = [
      // Bottom
      Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, { isStatic: true, render: { visible: false } }),
      // Top
      Bodies.rectangle(w / 2, -thickness / 2, w, thickness, { isStatic: true, render: { visible: false } }),
      // Left
      Bodies.rectangle(-thickness / 2, h / 2, thickness, h, { isStatic: true, render: { visible: false } }),
      // Right
      Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, { isStatic: true, render: { visible: false } })
    ];

    this.walls = walls;
    Composite.add(this.engine.world, walls);
  }

  setupMouseInteraction(Mouse, MouseConstraint, Composite) {
    const mouse = Mouse.create(this.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });

    // Enable pointer events for interaction
    this.canvas.style.pointerEvents = 'auto';

    Composite.add(this.engine.world, mouseConstraint);
    this.render.mouse = mouse;
  }

  drawIcons() {
    const ctx = this.render.context;

    this.bodies.forEach(body => {
      const tech = body.techData;
      if (!tech) return;

      const x = body.position.x;
      const y = body.position.y;

      // Draw glowing circle background
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fillStyle = `${tech.color}20`;
      ctx.fill();
      ctx.strokeStyle = `${tech.color}60`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      // Draw outer glow
      const gradient = ctx.createRadialGradient(x, y, 25, x, y, 50);
      gradient.addColorStop(0, `${tech.color}30`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  handleResize() {
    this.render.canvas.width = window.innerWidth;
    this.render.canvas.height = window.innerHeight;
    this.render.options.width = window.innerWidth;
    this.render.options.height = window.innerHeight;

    // Update walls
    if (this.walls) {
      const { Composite, Bodies } = Matter;
      this.walls.forEach(wall => Composite.remove(this.engine.world, wall));
      this.createWalls(Bodies, Composite);
    }
  }
}

// ===== 3. MOMENTUM-BASED HOVER EFFECTS =====
class MomentumHover {
  constructor() {
    this.cards = document.querySelectorAll('.bento-item, .project-card');
    if (prefersReducedMotion) return;

    this.mouseHistory = [];
    this.maxHistory = 5;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.classList.add('momentum-card');

      let isActive = false;
      let lastX = 0, lastY = 0;
      let velocityX = 0, velocityY = 0;
      let animationFrame = null;

      card.addEventListener('mouseenter', (e) => {
        isActive = true;
        card.classList.add('active');
        lastX = e.clientX;
        lastY = e.clientY;
        this.mouseHistory = [];
      });

      card.addEventListener('mousemove', (e) => {
        if (!isActive) return;

        // Track mouse history for velocity calculation
        this.mouseHistory.push({
          x: e.clientX,
          y: e.clientY,
          time: Date.now()
        });

        if (this.mouseHistory.length > this.maxHistory) {
          this.mouseHistory.shift();
        }

        // Calculate velocity based on mouse history
        if (this.mouseHistory.length >= 2) {
          const oldest = this.mouseHistory[0];
          const newest = this.mouseHistory[this.mouseHistory.length - 1];
          const timeDiff = newest.time - oldest.time;

          if (timeDiff > 0) {
            velocityX = (newest.x - oldest.x) / timeDiff * 10;
            velocityY = (newest.y - oldest.y) / timeDiff * 10;
          }
        }

        // Clamp velocity
        velocityX = Math.max(-30, Math.min(30, velocityX));
        velocityY = Math.max(-30, Math.min(30, velocityY));

        // Calculate rotation based on velocity
        const rotation = velocityX * 0.5;

        // Apply transforms
        card.style.setProperty('--momentum-x', velocityX);
        card.style.setProperty('--momentum-y', velocityY);
        card.style.setProperty('--momentum-rotation', `${rotation}deg`);
        card.style.setProperty('--momentum-scale', 1.02);

        lastX = e.clientX;
        lastY = e.clientY;
      });

      card.addEventListener('mouseleave', () => {
        isActive = false;
        card.classList.remove('active');

        // Animate back with inertia
        const startVelX = velocityX;
        const startVelY = velocityY;
        const startTime = Date.now();
        const duration = 500;

        const animateInertia = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          const easeOut = 1 - Math.pow(1 - progress, 3);

          const currentVelX = startVelX * (1 - easeOut);
          const currentVelY = startVelY * (1 - easeOut);
          const currentRotation = currentVelX * 0.5 * (1 - easeOut);

          card.style.setProperty('--momentum-x', currentVelX);
          card.style.setProperty('--momentum-y', currentVelY);
          card.style.setProperty('--momentum-rotation', `${currentRotation}deg`);
          card.style.setProperty('--momentum-scale', 1 + 0.02 * (1 - easeOut));

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animateInertia);
          } else {
            card.style.setProperty('--momentum-x', 0);
            card.style.setProperty('--momentum-y', 0);
            card.style.setProperty('--momentum-rotation', '0deg');
            card.style.setProperty('--momentum-scale', 1);
          }
        };

        if (animationFrame) cancelAnimationFrame(animationFrame);
        animateInertia();
      });
    });
  }
}

// ===== 4. PINNED SCROLL INTERACTIONS =====
class PinnedScroll {
  constructor() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    this.setupHeroPinning();
    this.setupClipPathTransitions();
  }

  setupHeroPinning() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (!hero || !heroContent) return;

    // Create scroll-driven shrink effect for hero
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = 1 - (progress * 0.15);
        const opacity = 1 - (progress * 0.6);

        heroContent.style.setProperty('--shrink-scale', scale);
        heroContent.style.setProperty('--shrink-opacity', opacity);
        heroContent.classList.add('shrinking');
      }
    });
  }

  setupClipPathTransitions() {
    const bentoItems = document.querySelectorAll('.bento-item[data-shape]');

    bentoItems.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: () => {
          gsap.fromTo(item,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              delay: index * 0.1
            }
          );
        }
      });
    });
  }
}

// ===== 5. SCROLL PROGRESS INDICATOR =====
class ScrollProgress {
  constructor() {
    if (prefersReducedMotion) return;
    this.createProgressBar();
    this.init();
  }

  createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.id = 'scroll-progress-bar';

    progressContainer.appendChild(progressBar);
    document.body.prepend(progressContainer);

    this.progressBar = progressBar;
  }

  init() {
    window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    this.updateProgress();
  }

  updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    this.progressBar.style.width = `${progress}%`;
  }
}

// ===== 6. SPOTLIGHT CARD EFFECT =====
class SpotlightEffect {
  constructor() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.bento-item, .skill-card, .homelab-card, .blog-card');
    cards.forEach(card => {
      card.classList.add('spotlight-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--spotlight-x', `${x}px`);
        card.style.setProperty('--spotlight-y', `${y}px`);

        // Update the pseudo-element position
        const spotlight = card.querySelector('.spotlight-overlay') || this.createSpotlight(card);
        spotlight.style.left = `${x}px`;
        spotlight.style.top = `${y}px`;
      });
    });
  }

  createSpotlight(card) {
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-overlay';
    spotlight.style.cssText = `
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(0, 210, 106, 0.15) 0%, transparent 70%);
      pointer-events: none;
      z-index: 10;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(spotlight);
    return spotlight;
  }
}

// ===== 7. STAGGER REVEAL ON SCROLL =====
class StaggerReveal {
  constructor() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    // Stagger reveal for bento items
    const bentoItems = gsap.utils.toArray('.bento-item');
    if (bentoItems.length > 0) {
      ScrollTrigger.batch(bentoItems, {
        onEnter: batch => {
          gsap.fromTo(batch,
            {
              y: 50,
              opacity: 0,
              scale: 0.95
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15
            }
          );
        },
        start: 'top 85%'
      });
    }

    // Stagger reveal for skill cards
    const skillCards = gsap.utils.toArray('.skill-card');
    if (skillCards.length > 0) {
      ScrollTrigger.batch(skillCards, {
        onEnter: batch => {
          gsap.fromTo(batch,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.1
            }
          );
        },
        start: 'top 85%'
      });
    }
  }
}

// ===== INITIALIZE ALL TESORO-INSPIRED FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
  // Wait for all libraries to load
  setTimeout(() => {
    // Initialize character animations
    new CharacterAnimator();

    // Initialize physics icons (only on index page with hero)
    if (document.querySelector('#physics-canvas')) {
      new PhysicsIcons();
    }

    // Initialize momentum hover effects
    new MomentumHover();

    // Initialize pinned scroll interactions
    new PinnedScroll();

    // Initialize scroll progress
    new ScrollProgress();

    // Initialize spotlight effect
    new SpotlightEffect();

    // Initialize stagger reveal
    new StaggerReveal();

    console.log('%c Tesoro-inspired 2025 features loaded!', 'color: #00D26A; font-size: 14px; font-weight: bold;');
  }, 100);
});

// ===== 2026 WOW FACTOR ENHANCEMENTS =====

// ===== COUNTING NUMBERS ANIMATION =====
class CountingNumbers {
  constructor() {
    this.numbers = document.querySelectorAll('.stat-number[data-target], .number-value[data-target]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          this.animateNumber(entry.target);
          entry.target.dataset.counted = 'true';
        }
      });
    }, { threshold: 0.5 });

    this.numbers.forEach(num => observer.observe(num));
  }

  animateNumber(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(start + (target - start) * easedProgress);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  }
}

// ===== PARALLAX SPLASH SCREEN =====
class ParallaxSplash {
  constructor() {
    this.splash = document.getElementById('splash-screen');
    this.logo = document.querySelector('.splash-logo');
    if (!this.splash || prefersReducedMotion) return;

    this.init();
  }

  init() {
    // Add floating animation enhancement
    if (this.logo) {
      document.addEventListener('mousemove', (e) => {
        if (this.splash && !this.splash.classList.contains('hidden')) {
          const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
          const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
          this.logo.style.transform = `translate(${xAxis}px, ${yAxis}px) scale(1)`;
        }
      });
    }

    // Add particle background
    this.createParticles();
  }

  createParticles() {
    if (!this.splash) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'splash-particles';
    particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    `;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;
      const xStart = Math.random() * 100;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, var(--primary-light), var(--primary));
        border-radius: 50%;
        left: ${xStart}%;
        bottom: -20px;
        opacity: ${Math.random() * 0.5 + 0.3};
        box-shadow: 0 0 ${size * 3}px var(--primary-glow);
        animation: floatUp ${duration}s linear ${delay}s infinite;
      `;

      particlesContainer.appendChild(particle);
    }

    this.splash.insertBefore(particlesContainer, this.splash.firstChild);

    // Add float up animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== ENHANCED PROJECT CARDS =====
class EnhancedProjectCards {
  constructor() {
    this.cards = document.querySelectorAll('.project-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      // Add magnetic hover effect
      card.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px) scale(1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });

      // Add ripple effect on click
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary-glow), transparent);
          left: ${x}px;
          top: ${y}px;
          transform: scale(0);
          opacity: 1;
          pointer-events: none;
          animation: rippleEffect 0.8s ease-out;
        `;

        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
      });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleEffect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== SMOOTH SECTION REVEALS =====
class SmoothSectionReveals {
  constructor() {
    this.sections = document.querySelectorAll('.tesoro-section');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      observer.observe(section);
    });
  }
}

// Initialize 2026 enhancements
document.addEventListener('DOMContentLoaded', () => {
  new CountingNumbers();
  new ParallaxSplash();
  new EnhancedProjectCards();
  new SmoothSectionReveals();

  console.log('%c ✨ 2026 WOW Factor: LOADED ✨', 'color: #D4A03A; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(212, 160, 58, 0.8);');
});
