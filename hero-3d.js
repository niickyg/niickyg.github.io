// 3D Hero Scene - Stunning Geometric Animation
// Uses Three.js to create an immersive 3D experience

(function() {
  'use strict';

  // Only run if Three.js is loaded and we're on the hero section
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

  // Create the main 3D geometric shape - Torus Knot for maximum wow factor
  const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);

  // Create a gradient-like material using vertex colors or shaders
  const material = new THREE.MeshStandardMaterial({
    color: 0x8B5CF6, // Purple primary
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x8B5CF6,
    emissiveIntensity: 0.3,
    flatShading: false
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  // Add particles for extra wow factor
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xA78BFA, // Purple light
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lighting for depth and drama
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8B5CF6, 2);
  pointLight1.position.set(2, 3, 4);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xF7B42C, 1.5);
  pointLight2.position.set(-2, -2, -2);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xFF8585, 1);
  pointLight3.position.set(0, 0, 3);
  scene.add(pointLight3);

  // Mouse interaction variables
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  // Mouse move handler for interaction
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Touch support for mobile
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  });

  // Scroll handling - hide 3D scene when scrolling past hero
  let heroVisible = true;
  const heroSection = document.querySelector('.hero-3d');

  window.addEventListener('scroll', () => {
    if (!heroSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    canvas.style.opacity = heroVisible ? '1' : '0';
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    if (!heroVisible) return;

    // Rotate the torus knot
    torusKnot.rotation.x += 0.003;
    torusKnot.rotation.y += 0.005;

    // Add mouse interaction - smooth following
    targetRotationX = mouseY * 0.3;
    targetRotationY = mouseX * 0.3;

    torusKnot.rotation.x += (targetRotationX - torusKnot.rotation.x) * 0.05;
    torusKnot.rotation.y += (targetRotationY - torusKnot.rotation.y) * 0.05;

    // Animate particles
    particlesMesh.rotation.y += 0.0005;

    // Pulsing effect on the shape
    const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
    torusKnot.scale.set(scale, scale, scale);

    // Slowly move lights for dynamic lighting
    pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
    pointLight1.position.y = Math.cos(Date.now() * 0.001) * 3;

    pointLight2.position.x = Math.cos(Date.now() * 0.0007) * 3;
    pointLight2.position.z = Math.sin(Date.now() * 0.0007) * 3;

    renderer.render(scene, camera);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Start animation
  animate();

  // Fade in the canvas
  setTimeout(() => {
    canvas.style.transition = 'opacity 1s ease-in-out';
    canvas.style.opacity = '1';
  }, 100);

})();
