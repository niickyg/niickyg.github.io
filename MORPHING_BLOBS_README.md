# Scroll-Driven Morphing Blob Transitions

## Overview

This feature implements large, organic blob shapes that morph and change color as you scroll through the portfolio. The blobs act as animated section dividers between major sections, creating a seamless liquid theme that enhances navigation flow.

## Features

### 1. Organic Morphing Animation
- **Smooth Catmull-Rom Splines**: Creates smooth, organic curves between control points
- **Continuous Morphing**: Blobs constantly morph between different organic shapes
- **Natural Movement**: Uses Perlin-like noise functions for natural variation

### 2. Scroll Velocity Response
- **Speed Detection**: Detects how fast you're scrolling
- **Dramatic Effects**: Faster scrolling creates more dramatic morphs and larger blobs
- **Direction Awareness**: Responds differently to up vs down scrolling
- **Velocity Decay**: Smooth deceleration after scrolling stops

### 3. Color Palette Integration
- **Teal Gradients**: `#4ECDC4`, `#44A08D`, `#3CAEA3`
- **Green Gradients**: `#60D394`, `#AAF683`, `#6BCF7F`
- **Coral Gradients**: `#FF9B85`, `#FFD97D`, `#F38181`
- **Radial Gradients**: Smooth color transitions within each blob
- **Section-Specific Colors**: Each divider has a unique color scheme

### 4. Blend Modes
- **Screen**: Brightens overlapping areas
- **Overlay**: Creates rich color mixing
- **Soft-light**: Subtle glow effects
- **Color-dodge**: Dramatic highlights
- **Automatic Rotation**: Different blend modes for visual variety

### 5. Performance Optimizations
- **RequestAnimationFrame**: Smooth 60fps animations
- **Throttled Scroll Events**: Prevents performance bottlenecks
- **GPU Acceleration**: Uses CSS transforms for hardware acceleration
- **Content Visibility**: Only renders visible blobs
- **Reduced Motion Support**: Respects user accessibility preferences

## File Structure

```
/home/user0/niickyg.github.io/
├── morphing-blobs.js       # Main JavaScript implementation
├── morphing-blobs.css      # Styling and animations
├── index.html              # Updated with blob includes
└── MORPHING_BLOBS_README.md # This documentation
```

## Architecture

### Classes

#### `MorphingBlob`
The core class that creates and animates individual blob shapes.

**Constructor Options:**
```javascript
{
  points: 8,              // Number of control points
  baseRadius: 200,        // Base size in pixels
  variation: 0.4,         // Shape variation (0-1)
  colorStops: [...],      // Gradient color stops
  blendMode: 'screen'     // CSS blend mode
}
```

**Key Methods:**
- `init()`: Initializes the SVG and starts animation
- `createSVG()`: Creates SVG element with gradients and filters
- `generateShapes()`: Creates base and target shapes for morphing
- `createSmoothPath()`: Generates smooth Catmull-Rom spline paths
- `updateScrollVelocity()`: Handles scroll velocity calculations
- `animate()`: Main animation loop using requestAnimationFrame

#### `BlobDividerSystem`
Manages all blob dividers across the page.

**Key Methods:**
- `init()`: Sets up the system when DOM is ready
- `createDividers()`: Inserts blob dividers between sections
- `setupScrollListener()`: Configures optimized scroll handling

### Color Schemes

Each section divider uses a carefully chosen color palette:

1. **About Section** (Teal-Green)
   - Offset 0%: `#4ECDC4` (Teal)
   - Offset 50%: `#60D394` (Green)
   - Offset 100%: `#44A08D` (Dark Teal)

2. **Projects Section** (Green-Lime)
   - Offset 0%: `#60D394` (Green)
   - Offset 50%: `#AAF683` (Lime)
   - Offset 100%: `#4ECDC4` (Teal)

3. **Homelab Section** (Lime-Yellow)
   - Offset 0%: `#AAF683` (Lime)
   - Offset 50%: `#FFD97D` (Yellow)
   - Offset 100%: `#60D394` (Green)

4. **Blog Section** (Yellow-Coral)
   - Offset 0%: `#FFD97D` (Yellow)
   - Offset 50%: `#FF9B85` (Coral)
   - Offset 100%: `#AAF683` (Lime)

5. **Contact Section** (Coral-Teal)
   - Offset 0%: `#FF9B85` (Coral)
   - Offset 50%: `#4ECDC4` (Teal)
   - Offset 100%: `#60D394` (Green)

## Implementation Details

### SVG Path Generation

The blobs use Catmull-Rom splines for smooth, organic curves:

```javascript
// Calculate control points for smooth curves
const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

// Create cubic bezier curve
path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
```

### Scroll Velocity Detection

Scroll velocity is calculated and applied to blob transformations:

```javascript
updateScrollVelocity(scrollY) {
  const delta = scrollY - this.lastScrollY;
  this.scrollVelocity = delta;
  this.scrollDirection = delta > 0 ? 1 : -1;

  // Apply to blob position with velocity influence
  const velocityInfluence = Math.abs(this.scrollVelocity) * 0.5;
  const velocityX = this.scrollDirection * velocityInfluence * Math.cos(i);
  const velocityY = velocityInfluence * Math.sin(i);
}
```

### Morphing Animation

Smooth interpolation between shapes using easing:

```javascript
easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Interpolate between base and target shapes
const currentPoints = this.baseShape.map((point, i) => {
  const target = this.targetShape[i];
  const easedProgress = this.easeInOutCubic(this.currentMorph);

  return {
    x: this.interpolate(point.x, target.x, easedProgress),
    y: this.interpolate(point.y, target.y, easedProgress)
  };
});
```

## Browser Compatibility

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Graceful Degradation
- Older browsers: Blobs display but with simpler animations
- Reduced motion: Respects `prefers-reduced-motion` setting
- High contrast: Adds visible borders for accessibility

## Performance Metrics

### Target Performance
- **Frame Rate**: 60 FPS
- **CPU Usage**: < 10% on modern devices
- **Memory**: < 50MB additional footprint
- **Scroll Jank**: None (optimized with requestAnimationFrame)

### Optimization Techniques
1. **Request Animation Frame**: Synced with browser refresh rate
2. **Throttled Scroll Events**: Max 60 updates/second
3. **GPU Acceleration**: CSS transforms and will-change hints
4. **Efficient Path Generation**: Pre-calculated spline coefficients
5. **Lazy Rendering**: Only active blobs animate

## Customization

### Adding More Blobs Per Divider

```javascript
const blob3 = new MorphingBlob(divider, {
  colorStops: [...],
  baseRadius: scheme.baseRadius * 0.5,
  points: 6,
  variation: 0.2
});

this.dividers.push({ element: divider, blobs: [blob1, blob2, blob3], section });
```

### Changing Morph Speed

```javascript
this.morphSpeed = 0.05; // Default
this.morphSpeed = 0.1;  // Faster morphing
this.morphSpeed = 0.02; // Slower, more dramatic morphing
```

### Custom Color Schemes

```javascript
const customScheme = {
  colorStops: [
    { offset: '0%', color: '#FF00FF', opacity: '0.7' },
    { offset: '50%', color: '#00FFFF', opacity: '0.8' },
    { offset: '100%', color: '#FFFF00', opacity: '0.6' }
  ],
  baseRadius: 300,
  points: 12,
  variation: 0.6
};
```

### Blend Mode Customization

Available blend modes:
- `screen` - Brightens overlapping areas
- `overlay` - Rich color mixing
- `soft-light` - Subtle glow
- `color-dodge` - Dramatic highlights
- `multiply` - Darkens overlapping areas
- `lighten` - Takes lighter color
- `darken` - Takes darker color

## Accessibility

### Features
- **Reduced Motion**: Honors `prefers-reduced-motion` media query
- **High Contrast**: Adds visible borders in high contrast mode
- **Keyboard Navigation**: Blobs don't interfere with tab navigation
- **Screen Readers**: Purely decorative, hidden from assistive tech

### Implementation
```css
@media (prefers-reduced-motion: reduce) {
  .morph-blob-svg {
    animation: none;
    transition: none;
  }
}

@media (prefers-contrast: high) {
  .blob-divider {
    border-top: 2px solid rgba(96, 211, 148, 0.5);
    border-bottom: 2px solid rgba(96, 211, 148, 0.5);
  }
}
```

## Testing Checklist

- [x] Blobs appear between all major sections
- [x] Smooth morphing animation at 60fps
- [x] Scroll velocity affects blob size and movement
- [x] Colors match site palette (teal, green, coral)
- [x] Blend modes create visual interest
- [x] Works on mobile devices (tested down to 320px width)
- [x] No performance issues on slower devices
- [x] Respects reduced motion preferences
- [x] No JavaScript errors in console
- [x] Blobs don't interfere with section content

## Known Issues & Limitations

1. **Safari < 14**: Some blend modes may not work correctly
2. **Mobile Performance**: On very old devices, consider reducing blob count
3. **Battery Usage**: Continuous animation may increase battery consumption on mobile

## Future Enhancements

### Potential Additions
1. **Touch Interactions**: Blobs respond to touch/drag gestures
2. **Sound Integration**: Audio-reactive morphing
3. **Parallax Effects**: Different scroll speeds for layered blobs
4. **Particle Systems**: Smaller particles orbiting main blobs
5. **WebGL Version**: Even more complex morphing with shaders

### Advanced Features
```javascript
// Example: Audio-reactive morphing
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

function updateWithAudio() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

  // Scale blob based on audio amplitude
  this.baseRadius = 200 + average * 2;
}
```

## Troubleshooting

### Blobs Not Appearing
1. Check that both CSS and JS files are loaded
2. Verify sections have proper IDs
3. Check browser console for errors

### Performance Issues
1. Reduce number of blobs per divider
2. Decrease `points` parameter (fewer control points)
3. Lower `morphSpeed` for less frequent updates
4. Disable blur filters on mobile

### Color Issues
1. Verify gradient definitions in SVG defs
2. Check blend mode browser support
3. Ensure opacity values are between 0-1

## Code Example: Creating a Custom Blob

```javascript
// Create a container element
const container = document.createElement('div');
container.className = 'my-custom-blob-container';
document.body.appendChild(container);

// Create custom blob
const myBlob = new MorphingBlob(container, {
  points: 10,
  baseRadius: 250,
  variation: 0.5,
  colorStops: [
    { offset: '0%', color: '#8B5CF6', opacity: '0.7' },
    { offset: '50%', color: '#EC4899', opacity: '0.8' },
    { offset: '100%', color: '#F59E0B', opacity: '0.6' }
  ],
  blendMode: 'screen'
});

// Access the blob system
const system = window.MorphingBlobSystem.instance();
console.log('Total dividers:', system.dividers.length);
```

## Support & Maintenance

### Contact
- Developer: Nicholas Guerriero
- Email: me@nickguerriero.com
- GitHub: https://github.com/niickyg

### License
This feature is part of the Nicholas Guerriero portfolio and is proprietary code.

## Changelog

### Version 1.0.0 (2025-12-31)
- Initial implementation
- Scroll-driven morphing blobs
- Velocity-based effects
- Multi-color gradients
- Blend mode variations
- Performance optimizations
- Accessibility features
- Responsive design
- Browser compatibility
- Documentation
