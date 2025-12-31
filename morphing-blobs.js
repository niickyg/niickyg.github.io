// ===== SCROLL-DRIVEN MORPHING BLOB TRANSITIONS =====
// Large organic blob shapes that morph between sections
// Responds to scroll velocity and direction with dramatic effects

class MorphingBlob {
  constructor(container, options = {}) {
    this.container = container;
    this.svg = null;
    this.path = null;
    this.points = options.points || 8;
    this.baseRadius = options.baseRadius || 200;
    this.variation = options.variation || 0.4;
    this.colorStops = options.colorStops || [
      { offset: '0%', color: '#4ECDC4' },
      { offset: '50%', color: '#60D394' },
      { offset: '100%', color: '#FF9B85' }
    ];
    this.blendMode = options.blendMode || 'screen';

    // Animation state
    this.currentMorph = 0;
    this.targetMorph = 0;
    this.morphSpeed = 0.05;
    this.baseShape = [];
    this.targetShape = [];
    this.noiseOffset = Math.random() * 1000;

    // Scroll state
    this.lastScrollY = 0;
    this.scrollVelocity = 0;
    this.scrollDirection = 0;
    this.velocityDecay = 0.92;

    this.init();
  }

  init() {
    this.createSVG();
    this.generateShapes();
    this.animate();
  }

  createSVG() {
    // Create SVG element
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'morph-blob-svg');
    this.svg.setAttribute('viewBox', '0 0 800 600');
    this.svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    // Create defs for gradients and filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Create radial gradient
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', `blob-gradient-${Math.random().toString(36).substr(2, 9)}`);
    gradient.setAttribute('cx', '50%');
    gradient.setAttribute('cy', '50%');
    gradient.setAttribute('r', '60%');

    this.colorStops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('stop-color', stop.color);
      stopElement.setAttribute('stop-opacity', stop.opacity || '0.8');
      gradient.appendChild(stopElement);
    });

    defs.appendChild(gradient);

    // Create blur filter for smooth edges
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', `blob-blur-${Math.random().toString(36).substr(2, 9)}`);

    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '20');
    filter.appendChild(blur);

    defs.appendChild(filter);
    this.svg.appendChild(defs);

    // Create path element
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', `url(#${gradient.id})`);
    this.path.setAttribute('filter', `url(#${filter.id})`);
    this.svg.appendChild(this.path);

    this.container.appendChild(this.svg);
  }

  // Smooth noise function for organic movement
  noise(x) {
    return Math.sin(x * 0.5) * Math.cos(x * 0.3) * 0.5 + 0.5;
  }

  generateShapes() {
    this.baseShape = [];
    this.targetShape = [];

    const centerX = 400;
    const centerY = 300;

    for (let i = 0; i < this.points; i++) {
      const angle = (i / this.points) * Math.PI * 2;

      // Base shape
      const baseNoise = this.noise(this.noiseOffset + i) * this.variation;
      const baseR = this.baseRadius * (1 + baseNoise);
      this.baseShape.push({
        x: centerX + Math.cos(angle) * baseR,
        y: centerY + Math.sin(angle) * baseR
      });

      // Target shape (different variation)
      const targetNoise = this.noise(this.noiseOffset + i + 5) * this.variation;
      const targetR = this.baseRadius * (1 + targetNoise);
      this.targetShape.push({
        x: centerX + Math.cos(angle) * targetR,
        y: centerY + Math.sin(angle) * targetR
      });
    }
  }

  interpolate(start, end, progress) {
    return start + (end - start) * progress;
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  createSmoothPath(points, tension = 0.4) {
    if (points.length < 2) return '';

    const path = [];
    const closed = true;

    // Helper to get point with wrapping
    const getPoint = (i) => {
      const idx = ((i % points.length) + points.length) % points.length;
      return points[idx];
    };

    // Start path
    path.push(`M ${points[0].x} ${points[0].y}`);

    // Create smooth curves
    for (let i = 0; i < points.length; i++) {
      const p0 = getPoint(i - 1);
      const p1 = getPoint(i);
      const p2 = getPoint(i + 1);
      const p3 = getPoint(i + 2);

      // Calculate control points for Catmull-Rom spline
      const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
      const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
      const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
      const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

      path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }

    path.push('Z');
    return path.join(' ');
  }

  updateScrollVelocity(scrollY) {
    const delta = scrollY - this.lastScrollY;
    this.scrollVelocity = delta;
    this.scrollDirection = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    this.lastScrollY = scrollY;

    // Apply velocity decay
    this.scrollVelocity *= this.velocityDecay;
  }

  animate() {
    // Update morph progress
    this.currentMorph += this.morphSpeed;

    // Trigger new morph cycle
    if (this.currentMorph >= 1) {
      this.currentMorph = 0;
      this.noiseOffset += 10;
      this.generateShapes();
    }

    // Calculate eased progress
    const easedProgress = this.easeInOutCubic(this.currentMorph);

    // Interpolate between base and target shapes
    const currentPoints = this.baseShape.map((point, i) => {
      const target = this.targetShape[i];

      // Add scroll velocity influence for dramatic effect
      const velocityInfluence = Math.abs(this.scrollVelocity) * 0.5;
      const velocityX = this.scrollDirection * velocityInfluence * Math.cos(i);
      const velocityY = velocityInfluence * Math.sin(i);

      return {
        x: this.interpolate(point.x, target.x, easedProgress) + velocityX,
        y: this.interpolate(point.y, target.y, easedProgress) + velocityY
      };
    });

    // Update path
    const pathData = this.createSmoothPath(currentPoints);
    this.path.setAttribute('d', pathData);

    // Scale based on scroll velocity (faster scroll = bigger blob)
    const velocityScale = 1 + Math.abs(this.scrollVelocity) * 0.002;
    const rotation = this.currentMorph * 45 + this.scrollVelocity * 0.1;
    this.svg.style.transform = `scale(${velocityScale}) rotate(${rotation}deg)`;

    requestAnimationFrame(() => this.animate());
  }
}

// Section Divider Manager
class BlobDividerSystem {
  constructor() {
    this.dividers = [];
    this.scrollThrottle = null;
    this.lastScrollY = window.scrollY || window.pageYOffset;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createDividers());
    } else {
      this.createDividers();
    }

    this.setupScrollListener();
  }

  createDividers() {
    // Find all major sections
    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
      if (index === 0) return; // Skip first section (hero)

      // Create divider container
      const divider = document.createElement('div');
      divider.className = 'blob-divider';
      divider.setAttribute('data-section-index', index);

      // Insert before section
      section.parentNode.insertBefore(divider, section);

      // Determine color scheme based on section
      const colorSchemes = [
        // About section
        {
          colorStops: [
            { offset: '0%', color: '#4ECDC4', opacity: '0.6' },
            { offset: '50%', color: '#60D394', opacity: '0.7' },
            { offset: '100%', color: '#44A08D', opacity: '0.5' }
          ],
          baseRadius: 250,
          points: 8
        },
        // Projects section
        {
          colorStops: [
            { offset: '0%', color: '#60D394', opacity: '0.5' },
            { offset: '50%', color: '#AAF683', opacity: '0.6' },
            { offset: '100%', color: '#4ECDC4', opacity: '0.5' }
          ],
          baseRadius: 300,
          points: 10
        },
        // Homelab section
        {
          colorStops: [
            { offset: '0%', color: '#AAF683', opacity: '0.5' },
            { offset: '50%', color: '#FFD97D', opacity: '0.6' },
            { offset: '100%', color: '#60D394', opacity: '0.5' }
          ],
          baseRadius: 280,
          points: 9
        },
        // Blog section
        {
          colorStops: [
            { offset: '0%', color: '#FFD97D', opacity: '0.5' },
            { offset: '50%', color: '#FF9B85', opacity: '0.6' },
            { offset: '100%', color: '#AAF683', opacity: '0.5' }
          ],
          baseRadius: 260,
          points: 8
        },
        // Contact section
        {
          colorStops: [
            { offset: '0%', color: '#FF9B85', opacity: '0.5' },
            { offset: '50%', color: '#4ECDC4', opacity: '0.6' },
            { offset: '100%', color: '#60D394', opacity: '0.5' }
          ],
          baseRadius: 240,
          points: 7
        }
      ];

      const scheme = colorSchemes[(index - 1) % colorSchemes.length];

      // Create multiple blobs for layered effect
      const blob1 = new MorphingBlob(divider, {
        ...scheme,
        variation: 0.5
      });

      const blob2 = new MorphingBlob(divider, {
        colorStops: scheme.colorStops.map(s => ({
          ...s,
          opacity: String(parseFloat(s.opacity || '0.5') * 0.6)
        })),
        baseRadius: scheme.baseRadius * 0.7,
        points: scheme.points - 2,
        variation: 0.3
      });

      this.dividers.push({ element: divider, blobs: [blob1, blob2], section });
    });
  }

  setupScrollListener() {
    let ticking = false;

    const updateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      // Update all blobs with scroll velocity
      this.dividers.forEach(({ blobs }) => {
        blobs.forEach(blob => {
          blob.updateScrollVelocity(scrollY);
        });
      });

      this.lastScrollY = scrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }, { passive: true });
  }
}

// Initialize the blob divider system
let blobSystem = null;

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Morphing Blob Dividers...');
    blobSystem = new BlobDividerSystem();
  });
} else {
  console.log('🎨 Initializing Morphing Blob Dividers...');
  blobSystem = new BlobDividerSystem();
}

// Export for potential external use
window.MorphingBlobSystem = {
  MorphingBlob,
  BlobDividerSystem,
  instance: () => blobSystem
};
