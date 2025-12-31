# Morphing Blobs - Testing Guide

## Quick Start Testing

### 1. Open the Demo
Open `morphing-blobs-demo.html` in your browser to see the blobs in isolation:
```bash
# Navigate to the portfolio directory
cd /home/user0/niickyg.github.io

# Open in browser (Linux)
xdg-open morphing-blobs-demo.html

# Or use Python HTTP server
python3 -m http.server 8000
# Then visit: http://localhost:8000/morphing-blobs-demo.html
```

### 2. View in Full Portfolio
Open `index.html` to see blobs integrated between all sections:
```bash
# Open in browser
xdg-open index.html

# Or with Python server
python3 -m http.server 8000
# Then visit: http://localhost:8000/index.html
```

## What to Test

### Visual Tests

#### 1. Blob Appearance
- [ ] Blobs appear between each major section (About, Projects, 3D Scene, Homelab, Blog, Contact)
- [ ] Blobs have smooth, organic shapes (not jagged or pixelated)
- [ ] Colors match the site palette (teal, green, coral gradients)
- [ ] Gradients are smooth without banding

#### 2. Animation Quality
- [ ] Blobs morph continuously and smoothly
- [ ] No stuttering or jank during morphing
- [ ] Animation runs at ~60fps (check browser dev tools Performance tab)
- [ ] Morphing appears natural and organic, not mechanical

#### 3. Scroll Interaction
- [ ] **Slow Scroll**: Blobs gently pulse and morph
- [ ] **Fast Scroll**: Blobs become larger and more dramatic
- [ ] **Scroll Down**: Blobs respond differently than scrolling up
- [ ] **Scroll Stop**: Blobs gradually return to normal state

#### 4. Color & Blend Modes
- [ ] Different sections have different color schemes
- [ ] Blend modes create visual interest (screen, overlay, soft-light, color-dodge)
- [ ] Colors don't appear washed out or too dark
- [ ] Overlapping blobs create interesting color mixing

### Performance Tests

#### 1. Frame Rate (Chrome DevTools)
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Scroll through the page
5. Stop recording
6. Check FPS counter - should be 55-60fps consistently

**Expected Results:**
- FPS: 55-60 (green)
- CPU: < 15% on modern machines
- No long tasks (> 50ms)

#### 2. Memory Usage
1. Open Chrome DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot before scrolling
4. Scroll through entire page
5. Take another snapshot
6. Compare memory usage

**Expected Results:**
- Memory increase: < 50MB
- No memory leaks (should return to baseline after scrolling stops)

#### 3. Mobile Performance
Test on mobile devices or Chrome DevTools device emulation:
- [ ] iPhone 12 Pro (390x844)
- [ ] iPad (768x1024)
- [ ] Pixel 5 (393x851)
- [ ] Galaxy S20 (360x800)

**Expected Results:**
- Smooth animations on all devices
- No lag or stutter
- Blobs scale appropriately
- Touch scrolling works smoothly

### Browser Compatibility Tests

#### Desktop Browsers
- [ ] **Chrome 90+**: Full functionality
- [ ] **Firefox 88+**: Full functionality
- [ ] **Safari 14+**: Full functionality (check blend modes)
- [ ] **Edge 90+**: Full functionality

#### Mobile Browsers
- [ ] **Safari iOS**: Smooth scrolling and morphing
- [ ] **Chrome Android**: Full functionality
- [ ] **Samsung Internet**: Blend modes work correctly

### Accessibility Tests

#### 1. Reduced Motion
1. Enable reduced motion in OS settings:
   - **macOS**: System Preferences → Accessibility → Display → Reduce motion
   - **Windows**: Settings → Ease of Access → Display → Show animations
   - **Linux**: Varies by desktop environment

2. Reload page
3. Check that blobs still display but without animation

**Expected Results:**
- Blobs appear static (no morphing)
- No transitions or animations
- Page is still usable and readable

#### 2. High Contrast Mode
1. Enable high contrast in OS settings
2. Reload page

**Expected Results:**
- Blobs have visible borders
- Content remains readable
- Colors have sufficient contrast

#### 3. Screen Reader Testing
1. Use NVDA, JAWS, or VoiceOver
2. Navigate through page

**Expected Results:**
- Blobs don't interfere with navigation
- All content is accessible
- No unexpected announcements

### Responsive Design Tests

#### Breakpoints
Test at these viewport widths:
- [ ] **320px** (iPhone SE)
- [ ] **375px** (iPhone standard)
- [ ] **768px** (iPad portrait)
- [ ] **1024px** (iPad landscape)
- [ ] **1440px** (Desktop)
- [ ] **1920px** (Full HD)

**Expected Results:**
- Blobs scale appropriately
- No horizontal scrolling
- Margins are correct
- No overlapping content

### Edge Cases

#### 1. Very Fast Scrolling
- Hold Page Down key or scroll wheel rapidly
- Blobs should handle velocity smoothly
- No crashes or freezes

#### 2. Multiple Rapid Direction Changes
- Scroll down, immediately scroll up, repeat
- Blobs should respond correctly
- No visual glitches

#### 3. Resize During Animation
- Resize browser window while blobs are animating
- Blobs should adapt to new viewport
- No layout breaks

#### 4. Page Load
- Refresh page multiple times
- Blobs should load consistently
- No console errors

### Console Checks

Open browser console (F12) and check for:
- [ ] No JavaScript errors
- [ ] No CSS warnings
- [ ] Initialization message: "🎨 Initializing Morphing Blob Dividers..."
- [ ] No 404 errors for files

### Visual Regression Testing

#### Take Screenshots
1. Full page at 1920x1080
2. Mobile view at 375x667
3. Tablet view at 768x1024

**Compare:**
- Blob positions are consistent
- Colors are accurate
- No visual artifacts

### Performance Metrics

Use Lighthouse (Chrome DevTools):
```
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Performance" and "Desktop"
4. Click "Generate report"
```

**Target Scores:**
- Performance: > 90
- First Contentful Paint: < 1.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 200ms

### Developer Console Tests

Open browser console and run:

```javascript
// Check system is initialized
console.log(window.MorphingBlobSystem);

// Get instance
const system = window.MorphingBlobSystem.instance();

// Check dividers
console.log('Total dividers:', system.dividers.length);

// Inspect a blob
const firstBlob = system.dividers[0].blobs[0];
console.log('First blob config:', {
  points: firstBlob.points,
  baseRadius: firstBlob.baseRadius,
  variation: firstBlob.variation
});

// Check scroll velocity
setTimeout(() => {
  console.log('Scroll velocity:', firstBlob.scrollVelocity);
}, 1000);
```

**Expected Output:**
```
MorphingBlobSystem {
  MorphingBlob: class,
  BlobDividerSystem: class,
  instance: function
}
Total dividers: 6
First blob config: {
  points: 8,
  baseRadius: 250,
  variation: 0.5
}
Scroll velocity: 0 (or current velocity)
```

## Common Issues & Solutions

### Issue: Blobs Not Appearing
**Solutions:**
1. Check console for errors
2. Verify CSS and JS files are loaded (Network tab)
3. Ensure sections have proper IDs
4. Clear browser cache

### Issue: Poor Performance
**Solutions:**
1. Reduce number of blobs per divider
2. Decrease `points` parameter
3. Lower `morphSpeed`
4. Disable blur filters on mobile

### Issue: Colors Look Wrong
**Solutions:**
1. Check blend mode browser support
2. Verify gradient definitions
3. Test in different browsers
4. Adjust opacity values

### Issue: Scroll Detection Not Working
**Solutions:**
1. Check scroll event listener is attached
2. Verify requestAnimationFrame is supported
3. Test in different browsers
4. Check for JavaScript errors

## Automated Testing Script

Create a simple test runner:

```javascript
// test-blobs.js
const tests = {
  systemLoaded: () => typeof window.MorphingBlobSystem !== 'undefined',
  instanceCreated: () => window.MorphingBlobSystem.instance() !== null,
  dividersCreated: () => {
    const system = window.MorphingBlobSystem.instance();
    return system && system.dividers.length > 0;
  },
  blobsAnimating: () => {
    const system = window.MorphingBlobSystem.instance();
    if (!system || !system.dividers[0]) return false;
    const blob = system.dividers[0].blobs[0];
    return blob.currentMorph !== undefined;
  },
  svgCreated: () => {
    return document.querySelector('.morph-blob-svg') !== null;
  }
};

function runTests() {
  console.log('🧪 Running Morphing Blobs Tests...\n');

  let passed = 0;
  let failed = 0;

  for (const [name, test] of Object.entries(tests)) {
    try {
      const result = test();
      if (result) {
        console.log(`✅ ${name}: PASS`);
        passed++;
      } else {
        console.log(`❌ ${name}: FAIL`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name}: ERROR - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Run after page load
window.addEventListener('load', () => {
  setTimeout(runTests, 2000); // Wait 2s for initialization
});
```

Add to page:
```html
<script src="test-blobs.js"></script>
```

## Performance Benchmarks

### Target Metrics
- **Initial Load**: < 100ms
- **Morph Cycle**: 20-30s
- **Frame Time**: < 16.67ms (60fps)
- **Memory Usage**: < 50MB
- **CPU Usage**: < 10% on modern devices

### Measuring Performance

```javascript
// Performance measurement script
const measure = {
  frameCount: 0,
  startTime: performance.now(),

  logFPS() {
    this.frameCount++;
    const elapsed = performance.now() - this.startTime;

    if (elapsed >= 1000) {
      const fps = Math.round(this.frameCount / (elapsed / 1000));
      console.log(`FPS: ${fps}`);
      this.frameCount = 0;
      this.startTime = performance.now();
    }

    requestAnimationFrame(() => this.logFPS());
  }
};

// Start measuring
measure.logFPS();
```

## Browser Testing Matrix

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome  | 90+     | ✅      | ✅     | Pass   |
| Firefox | 88+     | ✅      | ✅     | Pass   |
| Safari  | 14+     | ✅      | ✅     | Pass   |
| Edge    | 90+     | ✅      | ✅     | Pass   |
| Samsung | Latest  | N/A     | ✅     | Pass   |
| Opera   | Latest  | ✅      | N/A    | Pass   |

## Final Checklist

Before declaring the feature complete:

- [ ] All visual tests pass
- [ ] Performance metrics meet targets
- [ ] Works on all major browsers
- [ ] Mobile experience is smooth
- [ ] Accessibility requirements met
- [ ] No console errors
- [ ] Documentation complete
- [ ] Demo page works
- [ ] Integration with main site successful
- [ ] Code is commented and clean

## Reporting Issues

If you find bugs or issues:

1. **Check browser console** for errors
2. **Note browser and version**
3. **Record steps to reproduce**
4. **Capture screenshot/video if possible**
5. **Check if issue persists in demo page**
6. **Test in different browser**

## Support

For questions or issues:
- Email: me@nickguerriero.com
- GitHub: https://github.com/niickyg
