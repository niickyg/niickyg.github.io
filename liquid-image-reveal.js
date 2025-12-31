// ===== LIQUID DISTORTION IMAGE REVEAL WITH WEBGL SHADERS =====

class LiquidImageReveal {
  constructor(container, imageUrl, options = {}) {
    this.container = container;
    this.imageUrl = imageUrl;
    this.options = {
      intensity: options.intensity || 0.8,
      speed: options.speed || 1.0,
      colorGlow: options.colorGlow !== false,
      fallbackEnabled: options.fallbackEnabled !== false,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    this.hovered = false;
    this.dominantColors = [];
    this.isWebGLSupported = this.checkWebGLSupport();

    this.init();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!this.isWebGLSupported && this.options.fallbackEnabled) {
      this.initFallback();
      return;
    }

    if (!this.isWebGLSupported) {
      console.warn('WebGL not supported, liquid image reveal disabled');
      return;
    }

    this.setupThreeJS();
    this.loadTexture();
    this.setupEventListeners();
    this.animate();
  }

  setupThreeJS() {
    // Get container dimensions
    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    this.camera.position.z = 1;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear container and add canvas
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
    this.container.style.overflow = 'hidden';
  }

  loadTexture() {
    const loader = new THREE.TextureLoader();
    loader.load(
      this.imageUrl,
      (texture) => {
        this.createMaterial(texture);
        this.extractDominantColors(texture.image);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        if (this.options.fallbackEnabled) {
          this.initFallback();
        }
      }
    );
  }

  createMaterial(texture) {
    const rect = this.container.getBoundingClientRect();

    // Vertex Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment Shader with Liquid Distortion
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uProgress;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uGlowColor;
      varying vec2 vUv;

      // Noise function for organic distortion
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;

        // Calculate distance from mouse
        float mouseDist = distance(uMouse, vUv);
        float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);

        // Pixelation effect (decreases as progress increases)
        float pixelSize = mix(0.03, 0.0, uProgress);
        if (pixelSize > 0.0) {
          uv = floor(uv / pixelSize) * pixelSize;
        }

        // Liquid distortion based on noise
        float noise1 = snoise(uv * 5.0 + uTime * 0.3);
        float noise2 = snoise(uv * 3.0 - uTime * 0.2);

        // Distortion amount decreases as progress increases
        float distortionAmount = mix(uIntensity * 0.15, 0.0, uProgress);
        distortionAmount += mouseInfluence * 0.1;

        // Apply liquid displacement
        vec2 displacement = vec2(noise1, noise2) * distortionAmount;
        vec2 distortedUV = uv + displacement;

        // Add swirl effect near mouse
        if (mouseInfluence > 0.0) {
          vec2 toMouse = uMouse - distortedUV;
          float angle = mouseInfluence * 3.14159 * 0.5;
          float s = sin(angle);
          float c = cos(angle);
          mat2 rotation = mat2(c, -s, s, c);
          distortedUV = uMouse + rotation * (distortedUV - uMouse);
        }

        // Sample texture
        vec4 texColor = texture2D(uTexture, distortedUV);

        // RGB split for glitch effect (decreases with progress)
        float splitAmount = mix(0.02, 0.0, uProgress) * (1.0 + mouseInfluence);
        if (splitAmount > 0.0) {
          float r = texture2D(uTexture, distortedUV + vec2(splitAmount, 0.0)).r;
          float g = texture2D(uTexture, distortedUV).g;
          float b = texture2D(uTexture, distortedUV - vec2(splitAmount, 0.0)).b;
          texColor = vec4(r, g, b, texColor.a);
        }

        // Glow effect based on extracted colors
        vec3 glow = uGlowColor * mouseInfluence * 0.3;
        texColor.rgb += glow;

        // Brightness adjustment based on progress
        float brightness = mix(0.5, 1.0, uProgress);
        texColor.rgb *= brightness;

        // Contrast enhancement
        float contrast = mix(0.7, 1.2, uProgress);
        texColor.rgb = ((texColor.rgb - 0.5) * contrast) + 0.5;

        gl_FragColor = texColor;
      }
    `;

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uProgress: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0.0 },
        uIntensity: { value: this.options.intensity },
        uGlowColor: { value: new THREE.Vector3(0.5, 0.7, 1.0) }
      },
      transparent: true
    });

    // Create geometry to match image aspect ratio
    const img = texture.image;
    const aspectRatio = img.width / img.height;
    const rect = this.container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;

    // Maintain aspect ratio
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  extractDominantColors(image) {
    if (!this.options.colorGlow) return;

    // Create canvas to analyze image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Sample colors from image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorCounts = {};

    // Sample every 10th pixel for performance
    for (let i = 0; i < imageData.length; i += 40) {
      const r = Math.round(imageData[i] / 51) * 51;
      const g = Math.round(imageData[i + 1] / 51) * 51;
      const b = Math.round(imageData[i + 2] / 51) * 51;
      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    // Find dominant color
    let maxCount = 0;
    let dominantColor = '128,128,128';
    for (const color in colorCounts) {
      if (colorCounts[color] > maxCount) {
        maxCount = colorCounts[color];
        dominantColor = color;
      }
    }

    const [r, g, b] = dominantColor.split(',').map(Number);

    // Update glow color in shader
    if (this.material) {
      this.material.uniforms.uGlowColor.value.set(r / 255, g / 255, b / 255);
    }

    // Store for external access
    this.dominantColors = [r, g, b];
  }

  setupEventListeners() {
    // Mouse move
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.targetMouse.x = (e.clientX - rect.left) / rect.width;
      this.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    });

    // Mouse enter/leave
    this.container.addEventListener('mouseenter', () => {
      this.hovered = true;
    });

    this.container.addEventListener('mouseleave', () => {
      this.hovered = false;
      this.targetMouse.x = 0.5;
      this.targetMouse.y = 0.5;
    });

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;

    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    this.camera.left = width / -2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = height / -2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return;

    requestAnimationFrame(() => this.animate());

    // Smooth mouse following
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

    if (this.material) {
      // Update uniforms
      this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
      this.material.uniforms.uTime.value += 0.01 * this.options.speed;

      // Animate progress based on hover
      const targetProgress = this.hovered ? 1.0 : 0.0;
      const currentProgress = this.material.uniforms.uProgress.value;
      this.material.uniforms.uProgress.value += (targetProgress - currentProgress) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  initFallback() {
    // CSS-based fallback for browsers without WebGL
    this.container.innerHTML = `
      <div class="liquid-reveal-fallback" style="
        width: 100%;
        height: 100%;
        background-image: url('${this.imageUrl}');
        background-size: cover;
        background-position: center;
        filter: blur(8px) contrast(0.7);
        transition: filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      "></div>
    `;

    const fallbackEl = this.container.querySelector('.liquid-reveal-fallback');

    this.container.addEventListener('mouseenter', () => {
      fallbackEl.style.filter = 'blur(0px) contrast(1.2)';
    });

    this.container.addEventListener('mouseleave', () => {
      fallbackEl.style.filter = 'blur(8px) contrast(0.7)';
    });
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
    if (this.mesh) {
      this.mesh.geometry.dispose();
    }
    window.removeEventListener('resize', () => this.handleResize());
  }
}

// ===== INTEGRATION WITH BENTO GRID =====

class BentoGridLiquidReveal {
  constructor() {
    this.reveals = [];
    this.init();
  }

  init() {
    // Wait for DOM and Three.js to be ready
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, waiting...');
      setTimeout(() => this.init(), 100);
      return;
    }

    this.setupBentoItems();
  }

  setupBentoItems() {
    const bentoItems = document.querySelectorAll('.bento-item');

    bentoItems.forEach((item, index) => {
      const projectImage = item.querySelector('.project-image');
      if (!projectImage) return;

      // Create image URL from gradient or icon
      // For demo, we'll create placeholder images with gradients
      const imageUrl = this.createPlaceholderImage(index);

      // Wrap existing content
      const existingContent = projectImage.innerHTML;
      projectImage.innerHTML = '';

      // Create container for WebGL canvas
      const canvasContainer = document.createElement('div');
      canvasContainer.className = 'liquid-reveal-container';
      canvasContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
      `;

      // Create overlay for icon
      const overlay = document.createElement('div');
      overlay.className = 'liquid-reveal-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 2;
        transition: opacity 0.6s ease;
      `;
      overlay.innerHTML = existingContent;

      projectImage.appendChild(canvasContainer);
      projectImage.appendChild(overlay);
      projectImage.style.position = 'relative';

      // Initialize liquid reveal
      const reveal = new LiquidImageReveal(canvasContainer, imageUrl, {
        intensity: 0.8,
        speed: 1.0,
        colorGlow: true
      });

      this.reveals.push(reveal);

      // Fade out icon on hover
      item.addEventListener('mouseenter', () => {
        overlay.style.opacity = '0.3';
      });

      item.addEventListener('mouseleave', () => {
        overlay.style.opacity = '1';
      });
    });
  }

  createPlaceholderImage(index) {
    // Create gradient images using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Different gradient for each project
    const gradients = [
      ['#60D394', '#4ECDC4', '#3CAEA3'], // Mountain West Surface
      ['#8AB4F8', '#A78BFA', '#C084FC'], // GoTo Call Automation
      ['#FF9B85', '#FFD97D', '#AAF683'], // RDT Trading
      ['#4ECDC4', '#44A08D', '#3CAEA3'], // OANDA Trading
      ['#A78BFA', '#C084FC', '#E879F9']  // Media Server
    ];

    const colors = gradients[index % gradients.length];

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    // Add organic shapes
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 150 + 50;

      const shapeGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      shapeGradient.addColorStop(0, `${colors[i % colors.length]}40`);
      shapeGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = shapeGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas.toDataURL();
  }

  destroy() {
    this.reveals.forEach(reveal => reveal.destroy());
    this.reveals = [];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for everything to load
  setTimeout(() => {
    window.bentoGridLiquidReveal = new BentoGridLiquidReveal();
  }, 500);
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LiquidImageReveal, BentoGridLiquidReveal };
}
