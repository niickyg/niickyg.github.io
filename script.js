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

// ===== INTERACTIVE FEATURES & EASTER EGGS =====

// Mouse trail effect with colorful particles
let particles = [];
const colors = ['#4FC3F7', '#7E57C2', '#E91E63', '#00BCD4', '#9C27B0', '#FF6B6B'];

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

// ===== BRUTALIST 3D CHAOS MODE =====

let scene, camera, renderer, controls;
let projectMeshes = [];
let is3DMode = false;

// Mode toggle functionality
const toggleBtn = document.getElementById('toggle-btn');
const brutalistLanding = document.getElementById('brutalist-landing');
const threeContainer = document.getElementById('three-container');
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');

toggleBtn.addEventListener('click', () => {
  is3DMode = !is3DMode;

  if (is3DMode) {
    enter3DChaos();
  } else {
    exit3DChaos();
  }
});

function enter3DChaos() {
  // Hide 2D content
  brutalistLanding.style.display = 'none';
  sections.forEach(s => s.style.display = 'none');
  navbar.style.display = 'none';

  // Show 3D container
  threeContainer.classList.remove('hidden');

  // Update button
  toggleBtn.querySelector('.mode-text').textContent = 'EXIT 3D CHAOS';
  toggleBtn.style.background = '#0000FF';

  // Initialize 3D scene if not already
  if (!scene) {
    init3DScene();
  }

  animate3D();
}

function exit3DChaos() {
  // Show 2D content
  brutalistLanding.style.display = 'block';
  sections.forEach(s => s.style.display = 'block');
  navbar.style.display = 'flex';

  // Hide 3D container
  threeContainer.classList.add('hidden');

  // Update button
  toggleBtn.querySelector('.mode-text').textContent = 'ENTER 3D CHAOS';
  toggleBtn.style.background = '#FF0000';
}

function init3DScene() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 10, 50);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 20;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeContainer.appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xff0000, 1, 100);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x00ff00, 1, 100);
  pointLight2.position.set(-10, -10, 10);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x0000ff, 1, 100);
  pointLight3.position.set(0, 10, -10);
  scene.add(pointLight3);

  // Create scattered project cards
  createScatteredProjects();

  // Add mouse controls
  addMouseControls();

  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);
}

function createScatteredProjects() {
  const projects = [
    { name: 'GoTo\nAutomation', color: 0xff0000, pos: [-15, 5, -5] },
    { name: 'RDT\nTrading', color: 0x00ff00, pos: [10, -8, -10] },
    { name: 'OANDA\nBot', color: 0x0000ff, pos: [-5, 10, -15] },
    { name: 'Media\nServer', color: 0xff00ff, pos: [15, 0, 5] },
    { name: 'Mountain\nWest', color: 0x00ffff, pos: [0, -10, 0] },
    { name: 'HOMELAB', color: 0xffff00, pos: [-10, -5, -20] }
  ];

  projects.forEach(project => {
    // Create box geometry
    const geometry = new THREE.BoxGeometry(4, 4, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: project.color,
      emissive: project.color,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...project.pos);

    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    // Add edges for brutalist look
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    );
    mesh.add(line);

    // Store project data
    mesh.userData = { name: project.name, originalColor: project.color };

    scene.add(mesh);
    projectMeshes.push(mesh);
  });

  // Add connecting lines between projects
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.1,
    transparent: true
  });

  for (let i = 0; i < projectMeshes.length; i++) {
    for (let j = i + 1; j < projectMeshes.length; j++) {
      const points = [];
      points.push(projectMeshes[i].position);
      points.push(projectMeshes[j].position);

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
    }
  }
}

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function addMouseControls() {
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Scroll to zoom
  document.addEventListener('wheel', (e) => {
    if (!is3DMode) return;
    e.preventDefault();
    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.max(5, Math.min(50, camera.position.z));
  }, { passive: false });

  // Click to randomize positions
  renderer.domElement.addEventListener('click', () => {
    projectMeshes.forEach(mesh => {
      mesh.position.x += (Math.random() - 0.5) * 5;
      mesh.position.y += (Math.random() - 0.5) * 5;
      mesh.position.z += (Math.random() - 0.5) * 5;
    });
  });
}

function animate3D() {
  if (!is3DMode) return;

  requestAnimationFrame(animate3D);

  // Smooth camera movement following mouse
  targetX = mouseX * 10;
  targetY = mouseY * 10;

  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (targetY - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  // Rotate all project meshes
  projectMeshes.forEach((mesh, index) => {
    mesh.rotation.x += 0.003 * (index + 1);
    mesh.rotation.y += 0.005 * (index + 1);

    // Gentle floating animation
    mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Console message for curious developers
console.log('%c🌀 WELCOME TO THE ENHANCED MATRIX 🌀', 'color: #4FC3F7; font-size: 22px; font-weight: bold; text-shadow: 0 0 10px #4FC3F7;');
console.log('%c✨ Easter eggs found:', 'color: #E91E63; font-size: 16px; font-weight: bold;');
console.log('%c  🖱️  Mouse trail particles everywhere', 'color: #7E57C2; font-size: 13px;');
console.log('%c  👆 Click the logo 5 times', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  ⌨️  Try the Konami code (↑↑↓↓←→←→BA)', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  💬 Type "neon" anywhere for explosion', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  🪟 Type "glass" to toggle glassmorphism', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  👋 Double-click the hero section to shake', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  🎯 Click on cards for ripple effects', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  🎨 Hover over section titles for color magic', 'color: #4FC3F7; font-size: 13px;');
console.log('%c  🎪 3D tilt on cards when you hover', 'color: #4FC3F7; font-size: 13px;');
console.log('%c\n💎 Made with love, magic, and way too much caffeine', 'color: #E91E63; font-size: 12px; font-style: italic;');
