// ===== NEURAL NETWORK DATA VISUALIZATION WITH LIVE PARTICLE FLOW =====
// Replaces the SkillConstellation feature with an interactive neural network
// showing skills as nodes with flowing particle data streams

class NeuralParticle {
  constructor(fromNode, toNode, color) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.progress = 0;
    this.speed = 0.008 + Math.random() * 0.015;
    this.color = color;
    this.size = 2 + Math.random() * 3;
    this.trail = [];
    this.maxTrail = 10;
  }

  update() {
    this.progress += this.speed;

    // Add current position to trail
    const pos = this.getPosition();
    this.trail.push({ x: pos.x, y: pos.y, life: 1 });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    // Fade trail
    this.trail.forEach((t, i) => {
      t.life = i / this.maxTrail;
    });

    return this.progress >= 1;
  }

  getPosition() {
    const t = this.progress;
    // Simple linear interpolation for smooth particle flow
    const x = this.fromNode.x + (this.toNode.x - this.fromNode.x) * t;
    const y = this.fromNode.y + (this.toNode.y - this.fromNode.y) * t;
    return { x, y };
  }

  draw(ctx) {
    // Draw trail
    this.trail.forEach((t, i) => {
      const alpha = t.life * 0.6;
      const alphaHex = Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fillStyle = `${this.color}${alphaHex}`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.size * t.life, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw main particle with glow
    const pos = this.getPosition();
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.size * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class NeuralNode {
  constructor(x, y, label, color, type = 'skill') {
    this.x = x;
    this.y = y;
    this.label = label;
    this.color = color;
    this.type = type;
    this.radius = type === 'core' ? 50 : 36;
    this.connections = [];
    this.isActive = false;
    this.isHovered = false;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.activationLevel = 0;
    this.particles = [];
    this.thinkingPulse = 0;
  }

  activate() {
    this.isActive = true;
    this.activationLevel = 1;
    this.thinkingPulse = 1;

    // Create cascade of particles to connected nodes
    this.connections.forEach(targetNode => {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          this.particles.push(new NeuralParticle(this, targetNode, this.color));
        }, i * 60);
      }
    });
  }

  deactivate() {
    this.isActive = false;
  }

  update(mouseX, mouseY) {
    // Continuous pulse effect
    this.pulsePhase += 0.025;

    // Thinking pulse decay
    if (this.thinkingPulse > 0) {
      this.thinkingPulse *= 0.96;
    }

    // Activation level decay
    if (!this.isActive) {
      this.activationLevel *= 0.93;
    }

    // Check hover
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.isHovered = distance < this.radius + 12;

    // Update particles
    this.particles = this.particles.filter(p => {
      const done = p.update();
      return !done;
    });
  }

  draw(ctx) {
    const pulse = Math.sin(this.pulsePhase) * 0.12 + 1;
    const activeScale = this.isActive ? 1.15 : 1;
    const hoverScale = this.isHovered ? 1.08 : 1;
    const radius = this.radius * pulse * activeScale * hoverScale;

    // Processing pulse rings when active or thinking
    if (this.isActive || this.activationLevel > 0.15 || this.thinkingPulse > 0.1) {
      for (let i = 0; i < 3; i++) {
        const ringPhase = (this.pulsePhase * 0.8 + i * Math.PI * 0.66) % (Math.PI * 2);
        const ringAlpha = Math.max(0, 1 - (ringPhase / (Math.PI * 2))) * Math.max(this.activationLevel, this.thinkingPulse);
        const ringRadius = radius + (ringPhase / (Math.PI * 2)) * 45;

        const alphaHex = Math.floor(ringAlpha * 120).toString(16).padStart(2, '0');
        ctx.strokeStyle = `${this.color}${alphaHex}`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Outer glow
    const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 1.9);
    const glowAlpha = this.isActive ? 0.75 : this.isHovered ? 0.55 : 0.35;
    const glowAlphaHex = Math.floor(glowAlpha * 255).toString(16).padStart(2, '0');
    glowGradient.addColorStop(0, `${this.color}${glowAlphaHex}`);
    glowGradient.addColorStop(0.5, `${this.color}44`);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 1.9, 0, Math.PI * 2);
    ctx.fill();

    // Main node body
    const nodeGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
    nodeGradient.addColorStop(0, '#ffffff');
    nodeGradient.addColorStop(0.25, this.color);
    nodeGradient.addColorStop(1, `${this.color}AA`);
    ctx.fillStyle = nodeGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = this.isActive ? '#ffffff' : this.color;
    ctx.lineWidth = this.isActive ? 3.5 : 2.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner core for central node
    if (this.type === 'core') {
      const coreRadius = radius * 0.25;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, coreRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${this.isHovered ? 13 : 11}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.fillText(this.label, this.x, this.y);
    ctx.shadowBlur = 0;

    // Draw particles
    this.particles.forEach(p => p.draw(ctx));
  }

  drawConnection(ctx, other, isActive) {
    const baseAlpha = isActive ? 0.5 : 0.12;
    const width = isActive ? 2.2 : 1.2;

    // Create gradient for connection
    const gradient = ctx.createLinearGradient(this.x, this.y, other.x, other.y);
    const alpha1Hex = Math.floor(baseAlpha * 255).toString(16).padStart(2, '0');
    const alpha2Hex = Math.floor(baseAlpha * 255).toString(16).padStart(2, '0');
    gradient.addColorStop(0, `${this.color}${alpha1Hex}`);
    gradient.addColorStop(1, `${other.color}${alpha2Hex}`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(other.x, other.y);
    ctx.stroke();

    // Data flow indicator when active
    if (isActive) {
      const flowPhase = (Date.now() % 1800) / 1800;
      const flowX = this.x + (other.x - this.x) * flowPhase;
      const flowY = this.y + (other.y - this.y) * flowPhase;

      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(flowX, flowY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

class NeuralNetworkViz {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Neural network canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.nodes = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.activeNode = null;
    this.autoThinkingInterval = null;
    this.animationId = null;

    this.resize();
    this.init();
    this.setupEventListeners();
    this.animate();
    this.startAutoThinking();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
  }

  init() {
    const centerX = this.displayWidth / 2;
    const centerY = this.displayHeight / 2;

    // Define network structure with color palette from requirements
    const networkData = [
      { name: 'Innovation', color: '#60D394', type: 'core', connections: ['Leadership', 'Strategy', 'Sustainability', 'Entrepreneurship'] },
      { name: 'Leadership', color: '#4ECDC4', type: 'skill', connections: ['Innovation', 'Entrepreneurship', 'Strategy'] },
      { name: 'Strategy', color: '#FF9B85', type: 'skill', connections: ['Innovation', 'Leadership', 'Sustainability'] },
      { name: 'Sustainability', color: '#AAF683', type: 'skill', connections: ['Innovation', 'Strategy'] },
      { name: 'Entrepreneurship', color: '#A78BFA', type: 'skill', connections: ['Innovation', 'Leadership'] }
    ];

    this.nodes = [];

    // Position central core node
    const coreNode = new NeuralNode(centerX, centerY, networkData[0].name, networkData[0].color, 'core');
    this.nodes.push(coreNode);

    // Position other nodes in a circle around core
    const radius = Math.min(this.displayWidth, this.displayHeight) * 0.3;
    for (let i = 1; i < networkData.length; i++) {
      const angle = ((i - 1) / (networkData.length - 1)) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const node = new NeuralNode(x, y, networkData[i].name, networkData[i].color, 'skill');
      this.nodes.push(node);
    }

    // Set up bidirectional connections
    networkData.forEach((data, i) => {
      const node = this.nodes[i];
      data.connections.forEach(connName => {
        const targetNode = this.nodes.find(n => n.label === connName);
        if (targetNode && !node.connections.includes(targetNode)) {
          node.connections.push(targetNode);
        }
      });
    });
  }

  startAutoThinking() {
    // Random "thinking" pulses to show AI processing
    this.autoThinkingInterval = setInterval(() => {
      if (!this.activeNode && Math.random() > 0.4) {
        const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        randomNode.activate();
        setTimeout(() => randomNode.deactivate(), 1800);
      }
    }, 3500);
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      // Find hovered node
      let hoveredNode = null;
      this.nodes.forEach(node => {
        const dx = this.mouseX - node.x;
        const dy = this.mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius + 12) {
          hoveredNode = node;
        }
      });

      this.canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Find clicked node
      this.nodes.forEach(node => {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < node.radius + 12) {
          // Deactivate all nodes
          this.nodes.forEach(n => n.deactivate());

          // Activate clicked node and cascade
          node.activate();
          this.activeNode = node;

          // Cascade to connected nodes with stagger
          setTimeout(() => {
            node.connections.forEach((connNode, i) => {
              setTimeout(() => {
                connNode.activate();
                setTimeout(() => connNode.deactivate(), 1600);
              }, i * 180);
            });

            setTimeout(() => {
              node.deactivate();
              this.activeNode = null;
            }, 2200);
          }, 400);
        }
      });
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });

    const resizeHandler = () => {
      this.resize();
      this.nodes = [];
      this.init();
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeHandler, 250);
    });

    // Sync with skill card interactions
    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const skillName = card.querySelector('h3').textContent;
        const node = this.nodes.find(n => n.label === skillName);
        if (node) {
          node.isHovered = true;
        }
      });

      card.addEventListener('mouseleave', () => {
        const skillName = card.querySelector('h3').textContent;
        const node = this.nodes.find(n => n.label === skillName);
        if (node) {
          node.isHovered = false;
        }
      });

      card.addEventListener('click', () => {
        const skillName = card.querySelector('h3').textContent;
        const node = this.nodes.find(n => n.label === skillName);
        if (node) {
          this.nodes.forEach(n => n.deactivate());
          node.activate();
          setTimeout(() => node.deactivate(), 2000);
        }
      });
    });
  }

  animate() {
    // Clear canvas with slight fade for particle trails
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);

    // Draw all connections first (behind nodes)
    this.nodes.forEach(node => {
      node.connections.forEach(connNode => {
        const isActive = node.isActive || connNode.isActive || node.isHovered || connNode.isHovered;
        node.drawConnection(this.ctx, connNode, isActive);
      });
    });

    // Update and draw all nodes
    this.nodes.forEach(node => {
      node.update(this.mouseX, this.mouseY);
      node.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.autoThinkingInterval) {
      clearInterval(this.autoThinkingInterval);
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize neural network when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing neural network...');

  setTimeout(() => {
    const canvas = document.getElementById('neuralNetwork');
    if (canvas) {
      console.log('Canvas found, creating neural network visualization');
      try {
        window.neuralNetworkViz = new NeuralNetworkViz('neuralNetwork');
        console.log('Neural network initialized successfully!');
      } catch (error) {
        console.error('Error initializing neural network:', error);
      }
    } else {
      console.error('Canvas element #neuralNetwork not found!');
    }
  }, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.neuralNetworkViz) {
    window.neuralNetworkViz.destroy();
  }
});
