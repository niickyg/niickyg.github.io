// ===== 3D FLOATING ISLAND SCENE WITH SCROLL PARALLAX =====
// A visually impressive Three.js scene showcasing Nicholas's homelab and skills
// Features: Scroll-based camera movement, orbit controls, interactive objects, smooth animations

console.log('%c🏝️ 3D FLOATING ISLAND LOADING...', 'color: #60D394; font-size: 16px; font-weight: bold;');

// Scene state management
const SceneState = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  islands: [],
  interactiveObjects: [],
  raycaster: null,
  mouse: null,
  hoveredObject: null,
  selectedObject: null,
  scrollProgress: 0,
  isLowPerformance: false,
  animationId: null,
  composer: null,
  particles: null
};

// Configuration
const CONFIG = {
  islands: [
    {
      name: 'Homelab Server',
      position: { x: -8, y: 2, z: 0 },
      color: 0x4ECDC4,
      icon: '🖥️',
      description: 'Custom-built server running Fedora with Docker orchestration, Jellyfin media streaming, and enterprise-grade components.',
      details: [
        'Enterprise hardware with GPU acceleration',
        'NFS network storage',
        'Docker & containerization',
        'Automated media pipeline'
      ]
    },
    {
      name: 'Development Environment',
      position: { x: 0, y: 5, z: -5 },
      color: 0x60D394,
      icon: '💻',
      description: 'Professional development setup for building AI-powered automation systems, trading bots, and full-stack applications.',
      details: [
        'React & FastAPI expertise',
        'Python & JavaScript mastery',
        'AI/ML integration',
        'Production-ready deployments'
      ]
    },
    {
      name: 'Business & Leadership',
      position: { x: 8, y: 3, z: 2 },
      color: 0xFFD97D,
      icon: '💼',
      description: 'Founded Mountain West Surface, leading teams at Ski Butlers Park City, driving innovation and sustainable growth.',
      details: [
        'Team leadership & mentoring',
        'Business strategy',
        'Entrepreneurial ventures',
        'Sustainable practices'
      ]
    },
    {
      name: 'Trading Systems',
      position: { x: -4, y: -1, z: 8 },
      color: 0xFF9B85,
      icon: '📈',
      description: 'Algorithmic trading systems with multi-agent architecture, backtesting, and real-time market analysis.',
      details: [
        'RDT Trading methodology',
        'Risk management systems',
        'Statistical arbitrage',
        'Automated execution'
      ]
    },
    {
      name: 'Innovation Hub',
      position: { x: 5, y: 1, z: -8 },
      color: 0xA78BFA,
      icon: '💡',
      description: 'Creative problem-solving center where cutting-edge technologies meet real-world applications.',
      details: [
        'AI automation tools',
        'System architecture',
        'Process optimization',
        'Technology exploration'
      ]
    }
  ],
  camera: {
    fov: 60,
    near: 0.1,
    far: 1000,
    initialPosition: { x: 0, y: 8, z: 25 }
  },
  performance: {
    maxParticles: 2000,
    lowPerfParticles: 500,
    targetFPS: 60,
    qualityCheckInterval: 2000
  }
};

// Initialize the 3D scene
function init3DScene() {
  const container = document.getElementById('floating-island-container');
  if (!container) {
    console.error('Container element not found');
    return;
  }

  // Performance detection
  detectPerformance();

  // Create scene
  SceneState.scene = new THREE.Scene();
  SceneState.scene.fog = new THREE.Fog(0x0A1929, 20, 60);

  // Create camera
  const aspect = container.clientWidth / container.clientHeight;
  SceneState.camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    aspect,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  SceneState.camera.position.set(
    CONFIG.camera.initialPosition.x,
    CONFIG.camera.initialPosition.y,
    CONFIG.camera.initialPosition.z
  );

  // Create renderer
  SceneState.renderer = new THREE.WebGLRenderer({
    antialias: !SceneState.isLowPerformance,
    alpha: true,
    powerPreference: 'high-performance'
  });
  SceneState.renderer.setSize(container.clientWidth, container.clientHeight);
  SceneState.renderer.setPixelRatio(SceneState.isLowPerformance ? 1 : Math.min(window.devicePixelRatio, 2));
  SceneState.renderer.shadowMap.enabled = !SceneState.isLowPerformance;
  SceneState.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  SceneState.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  SceneState.renderer.toneMappingExposure = 1.2;
  container.appendChild(SceneState.renderer.domElement);

  // Raycaster for interaction
  SceneState.raycaster = new THREE.Raycaster();
  SceneState.mouse = new THREE.Vector2();

  // Create scene elements
  createLighting();
  createIslands();
  createParticleSystem();
  createEnvironment();

  // Setup controls
  setupOrbitControls();

  // Event listeners
  setupEventListeners();

  // Start animation loop
  animate();

  console.log('%c✨ 3D Scene initialized successfully!', 'color: #60D394; font-size: 14px;');
}

// Performance detection
function detectPerformance() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    SceneState.isLowPerformance = true;
    return;
  }

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Simple heuristic: integrated graphics or mobile
    if (renderer.toLowerCase().includes('intel') || /mobile|android/i.test(navigator.userAgent)) {
      SceneState.isLowPerformance = true;
    }
  }

  // Check device memory
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    SceneState.isLowPerformance = true;
  }

  console.log(`Performance mode: ${SceneState.isLowPerformance ? 'LOW' : 'HIGH'}`);
}

// Create dramatic lighting
function createLighting() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x8AB4F8, 0.4);
  SceneState.scene.add(ambientLight);

  // Main directional light (sun)
  const sunLight = new THREE.DirectionalLight(0xFFD97D, 1.2);
  sunLight.position.set(10, 20, 10);
  sunLight.castShadow = !SceneState.isLowPerformance;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -20;
  sunLight.shadow.camera.right = 20;
  sunLight.shadow.camera.top = 20;
  sunLight.shadow.camera.bottom = -20;
  SceneState.scene.add(sunLight);

  // Accent lights for visual interest
  const accentLight1 = new THREE.PointLight(0x60D394, 1.5, 30);
  accentLight1.position.set(-15, 5, -10);
  SceneState.scene.add(accentLight1);

  const accentLight2 = new THREE.PointLight(0xA78BFA, 1.5, 30);
  accentLight2.position.set(15, 5, 10);
  SceneState.scene.add(accentLight2);

  // Rim light for depth
  const rimLight = new THREE.DirectionalLight(0x4ECDC4, 0.6);
  rimLight.position.set(-10, 5, -10);
  SceneState.scene.add(rimLight);
}

// Create floating islands
function createIslands() {
  CONFIG.islands.forEach((islandConfig, index) => {
    const island = createIsland(islandConfig);
    SceneState.scene.add(island.group);
    SceneState.islands.push(island);
    SceneState.interactiveObjects.push(island.mesh);
  });
}

// Create individual island
function createIsland(config) {
  const group = new THREE.Group();

  // Main island platform (organic irregular shape)
  const platformGeometry = new THREE.DodecahedronGeometry(2, 0);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: config.color,
    roughness: 0.4,
    metalness: 0.3,
    emissive: config.color,
    emissiveIntensity: 0.2,
    flatShading: true
  });

  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.castShadow = !SceneState.isLowPerformance;
  platform.receiveShadow = !SceneState.isLowPerformance;
  platform.scale.set(1, 0.5, 1);

  // Store metadata
  platform.userData = {
    name: config.name,
    description: config.description,
    details: config.details,
    icon: config.icon,
    color: config.color
  };

  group.add(platform);

  // Floating rocks around the island
  for (let i = 0; i < 5; i++) {
    const rockGeometry = new THREE.TetrahedronGeometry(Math.random() * 0.3 + 0.2, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });

    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    const angle = (i / 5) * Math.PI * 2;
    const radius = 3 + Math.random() * 1.5;
    rock.position.set(
      Math.cos(angle) * radius,
      Math.random() * 2 - 1,
      Math.sin(angle) * radius
    );
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    group.add(rock);
  }

  // Glowing core
  const coreGeometry = new THREE.IcosahedronGeometry(0.8, 1);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: config.color,
    emissiveIntensity: 1,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.9
  });

  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.y = 0;
  group.add(core);

  // Particle ring around island
  const ringParticles = createIslandRing(config.color);
  group.add(ringParticles);

  // Position the group
  group.position.set(config.position.x, config.position.y, config.position.z);

  return {
    group,
    mesh: platform,
    core,
    config,
    ringParticles,
    floatOffset: Math.random() * Math.PI * 2
  };
}

// Create particle ring around island
function createIslandRing(color) {
  const particleCount = SceneState.isLowPerformance ? 30 : 60;
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 3.5;
    positions.push(
      Math.cos(angle) * radius,
      Math.sin(i * 0.5) * 0.5,
      Math.sin(angle) * radius
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geometry, material);
}

// Create ambient particle system
function createParticleSystem() {
  const particleCount = SceneState.isLowPerformance
    ? CONFIG.performance.lowPerfParticles
    : CONFIG.performance.maxParticles;

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  const colorPalette = [
    new THREE.Color(0x60D394),
    new THREE.Color(0x4ECDC4),
    new THREE.Color(0xFFD97D),
    new THREE.Color(0xFF9B85),
    new THREE.Color(0xA78BFA)
  ];

  for (let i = 0; i < particleCount; i++) {
    positions.push(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 80
    );

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  SceneState.particles = new THREE.Points(geometry, material);
  SceneState.scene.add(SceneState.particles);
}

// Create environment elements
function createEnvironment() {
  // Ground plane (ocean effect)
  const groundGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E3A5F,
    roughness: 0.3,
    metalness: 0.7,
    wireframe: false,
    transparent: true,
    opacity: 0.3
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -10;
  ground.receiveShadow = !SceneState.isLowPerformance;
  SceneState.scene.add(ground);

  // Animate ground vertices for wave effect
  ground.userData.update = (time) => {
    const positions = ground.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] = Math.sin(x * 0.1 + time) * 0.3 + Math.cos(z * 0.1 + time * 0.7) * 0.3;
    }
    ground.geometry.attributes.position.needsUpdate = true;
  };

  SceneState.scene.userData.ground = ground;
}

// Setup orbit controls
function setupOrbitControls() {
  // Note: OrbitControls would need to be imported separately
  // For now, we'll implement basic mouse-based camera rotation
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const canvas = SceneState.renderer.domElement;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const rotationSpeed = 0.005;

      // Rotate camera around the scene
      const radius = Math.sqrt(
        SceneState.camera.position.x ** 2 + SceneState.camera.position.z ** 2
      );

      const currentAngle = Math.atan2(SceneState.camera.position.z, SceneState.camera.position.x);
      const newAngle = currentAngle + deltaX * rotationSpeed;

      SceneState.camera.position.x = radius * Math.cos(newAngle);
      SceneState.camera.position.z = radius * Math.sin(newAngle);
      SceneState.camera.position.y += -deltaY * 0.05;

      SceneState.camera.lookAt(0, 2, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  // Scroll zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    const delta = e.deltaY * zoomSpeed;

    const direction = new THREE.Vector3();
    SceneState.camera.getWorldDirection(direction);

    SceneState.camera.position.add(direction.multiplyScalar(delta));

    // Clamp distance
    const distance = SceneState.camera.position.length();
    if (distance < 10) {
      SceneState.camera.position.normalize().multiplyScalar(10);
    } else if (distance > 50) {
      SceneState.camera.position.normalize().multiplyScalar(50);
    }
  }, { passive: false });
}

// Setup event listeners
function setupEventListeners() {
  // Mouse move for raycasting
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);

  // Scroll for camera movement
  window.addEventListener('scroll', onScroll);

  // Resize handler
  window.addEventListener('resize', onResize);
}

// Mouse move handler
function onMouseMove(event) {
  const container = document.getElementById('floating-island-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();

  SceneState.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  SceneState.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Raycast for hover effects
  SceneState.raycaster.setFromCamera(SceneState.mouse, SceneState.camera);
  const intersects = SceneState.raycaster.intersectObjects(SceneState.interactiveObjects);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (SceneState.hoveredObject !== object) {
      if (SceneState.hoveredObject) {
        SceneState.hoveredObject.material.emissiveIntensity = 0.2;
      }
      SceneState.hoveredObject = object;
      SceneState.hoveredObject.material.emissiveIntensity = 0.5;
      document.body.style.cursor = 'pointer';

      // Show tooltip
      showTooltip(object.userData, event.clientX, event.clientY);
    }
  } else {
    if (SceneState.hoveredObject) {
      SceneState.hoveredObject.material.emissiveIntensity = 0.2;
      SceneState.hoveredObject = null;
      document.body.style.cursor = 'default';
      hideTooltip();
    }
  }
}

// Click handler
function onClick(event) {
  if (!SceneState.hoveredObject) return;

  SceneState.selectedObject = SceneState.hoveredObject;

  // Show detail panel
  showDetailPanel(SceneState.selectedObject.userData);

  // Animate camera to focus on object
  const island = SceneState.islands.find(i => i.mesh === SceneState.selectedObject);
  if (island) {
    animateCameraToIsland(island);
  }
}

// Scroll handler for camera movement
function onScroll() {
  const container = document.getElementById('floating-island-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const containerHeight = rect.height;
  const scrollPosition = -rect.top;

  // Calculate scroll progress (0 to 1)
  SceneState.scrollProgress = Math.max(0, Math.min(1, scrollPosition / containerHeight));

  // Update camera position based on scroll
  updateCameraFromScroll();
}

// Update camera position based on scroll
function updateCameraFromScroll() {
  const progress = SceneState.scrollProgress;

  // Camera path: circular motion around the islands
  const angle = progress * Math.PI * 2;
  const radius = 25 - progress * 10; // Zoom in as we scroll
  const height = 8 + Math.sin(progress * Math.PI) * 5; // Arc up and down

  const targetX = Math.cos(angle) * radius;
  const targetY = height;
  const targetZ = Math.sin(angle) * radius;

  // Smooth interpolation
  SceneState.camera.position.x += (targetX - SceneState.camera.position.x) * 0.05;
  SceneState.camera.position.y += (targetY - SceneState.camera.position.y) * 0.05;
  SceneState.camera.position.z += (targetZ - SceneState.camera.position.z) * 0.05;

  SceneState.camera.lookAt(0, 2, 0);
}

// Animate camera to island
function animateCameraToIsland(island) {
  const targetPosition = island.group.position.clone();
  targetPosition.y += 3;
  targetPosition.z += 8;

  const startPosition = SceneState.camera.position.clone();
  const duration = 1500;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    SceneState.camera.position.lerpVectors(startPosition, targetPosition, eased);
    SceneState.camera.lookAt(island.group.position);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// Easing function
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Show tooltip
function showTooltip(data, x, y) {
  let tooltip = document.getElementById('island-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'island-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      padding: 1rem 1.5rem;
      background: rgba(10, 25, 41, 0.95);
      border: 2px solid ${data.color ? '#' + data.color.toString(16).padStart(6, '0') : '#60D394'};
      border-radius: 12px;
      color: #BFDBFE;
      font-size: 1rem;
      font-weight: 600;
      pointer-events: none;
      z-index: 10000;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      transform: translate(-50%, -120%);
    `;
    document.body.appendChild(tooltip);
  }

  tooltip.textContent = `${data.icon} ${data.name}`;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
  tooltip.style.display = 'block';
}

// Hide tooltip
function hideTooltip() {
  const tooltip = document.getElementById('island-tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

// Show detail panel
function showDetailPanel(data) {
  let panel = document.getElementById('island-detail-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'island-detail-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 600px;
      width: 90%;
      padding: 2.5rem;
      background: rgba(15, 23, 42, 0.98);
      border: 2px solid #60D394;
      border-radius: 24px;
      color: #BFDBFE;
      z-index: 10001;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: panelSlideIn 0.4s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes panelSlideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -60%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(panel);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: #60D394;
      font-size: 2rem;
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
      transition: all 0.3s ease;
    `;
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.color = '#FF9B85';
      closeBtn.style.transform = 'rotate(90deg)';
    });
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.color = '#60D394';
      closeBtn.style.transform = 'rotate(0deg)';
    });
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
    });
    panel.appendChild(closeBtn);
  }

  const colorHex = '#' + data.color.toString(16).padStart(6, '0');

  panel.innerHTML = `
    <button style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #60D394; font-size: 2rem; cursor: pointer; padding: 0.5rem; line-height: 1; transition: all 0.3s ease;" onclick="this.parentElement.style.display='none'">×</button>
    <div style="font-size: 3rem; margin-bottom: 1rem;">${data.icon}</div>
    <h2 style="color: ${colorHex}; font-size: 2rem; margin-bottom: 1.5rem; font-weight: 700;">${data.name}</h2>
    <p style="color: #B3E5FC; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem;">${data.description}</p>
    <h3 style="color: ${colorHex}; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 600;">Key Features:</h3>
    <ul style="list-style: none; padding: 0;">
      ${data.details.map(detail => `
        <li style="color: #BFDBFE; margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative; line-height: 1.6;">
          <span style="position: absolute; left: 0; color: ${colorHex};">▹</span>
          ${detail}
        </li>
      `).join('')}
    </ul>
  `;

  panel.style.display = 'block';
  panel.style.borderColor = colorHex;

  // Re-add close button functionality
  const closeBtn = panel.querySelector('button');
  closeBtn.addEventListener('mouseover', () => {
    closeBtn.style.color = '#FF9B85';
    closeBtn.style.transform = 'rotate(90deg)';
  });
  closeBtn.addEventListener('mouseout', () => {
    closeBtn.style.color = '#60D394';
    closeBtn.style.transform = 'rotate(0deg)';
  });
}

// Resize handler
function onResize() {
  const container = document.getElementById('floating-island-container');
  if (!container) return;

  SceneState.camera.aspect = container.clientWidth / container.clientHeight;
  SceneState.camera.updateProjectionMatrix();
  SceneState.renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
  SceneState.animationId = requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Animate islands (floating motion)
  SceneState.islands.forEach((island, index) => {
    const floatSpeed = 0.5;
    const floatAmount = 0.5;
    island.group.position.y = island.config.position.y + Math.sin(time * floatSpeed + island.floatOffset) * floatAmount;
    island.group.rotation.y += 0.002;

    // Rotate core
    island.core.rotation.x += 0.01;
    island.core.rotation.y += 0.015;

    // Rotate particle ring
    island.ringParticles.rotation.y += 0.005;
  });

  // Animate particles
  if (SceneState.particles) {
    SceneState.particles.rotation.y += 0.0002;
    SceneState.particles.rotation.x += 0.0001;
  }

  // Animate ground
  if (SceneState.scene.userData.ground) {
    SceneState.scene.userData.ground.userData.update(time);
  }

  // Render
  SceneState.renderer.render(SceneState.scene, SceneState.camera);
}

// Cleanup function
function cleanup3DScene() {
  if (SceneState.animationId) {
    cancelAnimationFrame(SceneState.animationId);
  }

  if (SceneState.renderer) {
    SceneState.renderer.dispose();
  }

  // Remove event listeners
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('click', onClick);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);

  console.log('3D Scene cleaned up');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Three.js to be available
  const checkThreeJS = setInterval(() => {
    if (typeof THREE !== 'undefined') {
      clearInterval(checkThreeJS);

      // Small delay to ensure container is ready
      setTimeout(() => {
        const container = document.getElementById('floating-island-container');
        if (container) {
          init3DScene();
        } else {
          console.warn('3D container not found - scene not initialized');
        }
      }, 100);
    }
  }, 100);

  // Timeout after 5 seconds
  setTimeout(() => {
    clearInterval(checkThreeJS);
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded - 3D scene not initialized');
    }
  }, 5000);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init3DScene, cleanup3DScene, SceneState };
}
