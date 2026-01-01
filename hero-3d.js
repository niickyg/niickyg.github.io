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

  // Create a 3D Rocketship
  const rocketGroup = new THREE.Group();

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xEEEEEE,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x8B5CF6,
    emissiveIntensity: 0.1
  });

  const noseMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B5CF6,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x8B5CF6,
    emissiveIntensity: 0.4
  });

  const finMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7B42C,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0xF7B42C,
    emissiveIntensity: 0.2
  });

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x60A5FA,
    metalness: 0.1,
    roughness: 0.1,
    emissive: 0x60A5FA,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.9
  });

  // Main body - sleek rocket cylinder
  const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0;
  rocketGroup.add(body);

  // Nose cone - sharp and aerodynamic
  const noseGeometry = new THREE.ConeGeometry(0.5, 1.2, 32);
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.y = 1.85;
  rocketGroup.add(nose);

  // Windows (spheres)
  const windowGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  for (let i = 0; i < 3; i++) {
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.y = 0.8 - (i * 0.5);
    window.position.z = 0.51;
    rocketGroup.add(window);
  }

  // Fins (4 triangular fins) - flat triangle shapes
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.4, -0.8);
  finShape.lineTo(0, -0.6);
  finShape.lineTo(0, 0);

  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.05,
    bevelEnabled: false
  });

  const finAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

  finAngles.forEach(angle => {
    const fin = new THREE.Mesh(finGeometry, finMaterial);
    fin.position.y = -0.7;
    fin.rotation.y = angle;
    // Position fin at edge of rocket body
    fin.position.x = Math.cos(angle) * 0.5;
    fin.position.z = Math.sin(angle) * 0.5;
    rocketGroup.add(fin);
  });

  // Engine boosters - pointing DOWN with flame effect
  const boosterPositions = [
    { x: 0.3, z: 0.3 },
    { x: -0.3, z: 0.3 },
    { x: 0.3, z: -0.3 },
    { x: -0.3, z: -0.3 }
  ];

  boosterPositions.forEach(pos => {
    // Booster nozzle
    const nozzleGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 16);
    const nozzleMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.2
    });
    const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
    nozzle.position.set(pos.x, -1.4, pos.z);
    rocketGroup.add(nozzle);

    // Flame/thrust - pointing DOWN
    const flameGeometry = new THREE.ConeGeometry(0.15, 0.8, 16);
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF8585,
      emissive: 0xFF8585,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.85
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.set(pos.x, -2.0, pos.z);
    // NO rotation - cone points up by default, so position it below
    rocketGroup.add(flame);

    // Inner flame glow (brighter)
    const innerFlameGeometry = new THREE.ConeGeometry(0.08, 0.6, 16);
    const innerFlameMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFAA,
      emissive: 0xFFFFAA,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9
    });
    const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    innerFlame.position.set(pos.x, -1.9, pos.z);
    rocketGroup.add(innerFlame);
  });

  // Scale and position the rocket
  rocketGroup.scale.set(1.5, 1.5, 1.5);
  rocketGroup.rotation.x = -0.3; // Tilt it slightly
  scene.add(rocketGroup);

  // Store flames for animation
  const flames = [];
  rocketGroup.children.forEach(child => {
    if (child.material && child.material.emissive &&
        (child.material.emissive.getHex() === 0xFF8585 ||
         child.material.emissive.getHex() === 0xFFFFAA)) {
      flames.push(child);
    }
  });

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

    // Gentle rotation of the rocket
    rocketGroup.rotation.y += 0.005;

    // Add mouse interaction - smooth following
    targetRotationX = mouseY * 0.2;
    targetRotationY = mouseX * 0.3;

    // Smooth mouse following
    rocketGroup.rotation.x += (targetRotationX - 0.3 - rocketGroup.rotation.x) * 0.05;
    rocketGroup.rotation.y += (targetRotationY - rocketGroup.rotation.y) * 0.05;

    // Animate particles
    particlesMesh.rotation.y += 0.0005;

    // Gentle floating effect on the rocket
    rocketGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;

    // Slowly move lights for dynamic lighting
    pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
    pointLight1.position.y = Math.cos(Date.now() * 0.001) * 3;

    pointLight2.position.x = Math.cos(Date.now() * 0.0007) * 3;
    pointLight2.position.z = Math.sin(Date.now() * 0.0007) * 3;

    // Animate flames - pulsing effect for realistic thrust
    flames.forEach((flame, index) => {
      const pulse = Math.sin(Date.now() * 0.01 + index) * 0.15 + 1;
      flame.scale.y = pulse;
      if (flame.material.opacity !== undefined) {
        flame.material.opacity = 0.7 + (pulse - 1) * 0.5;
      }
    });

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
