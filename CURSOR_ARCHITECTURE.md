# Magnetic Morphing Blob Cursor - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HTML Structure                               │
│                         (index.html)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ SVG Filter Definition (#gooey-cursor)                        │  │
│  │ ┌────────────────────────────────────────────────────────┐   │  │
│  │ │ feGaussianBlur (stdDeviation: 10)                       │   │  │
│  │ │         ↓                                               │   │  │
│  │ │ feColorMatrix (20x alpha boost, -10 offset)             │   │  │
│  │ │         ↓                                               │   │  │
│  │ │ feComposite (operator: atop)                            │   │  │
│  │ └────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Cursor Container (#cursor-container)                         │  │
│  │ [filter: url(#gooey-cursor) applied here]                   │  │
│  │                                                               │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Custom Cursor (#custom-cursor)                        │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │  │
│  │  │  │ Cursor Blob  │  │ Cursor Blob  │  │ Cursor Blob  │ │   │  │
│  │  │  │   (Layer 1)  │  │   (Layer 2)  │  │   (Layer 3)  │ │   │  │
│  │  │  │ opacity: 1.0 │  │ opacity: 0.8 │  │ opacity: 0.6 │ │   │  │
│  │  │  │ scale: 1.0   │  │ scale: 0.85  │  │ scale: 0.7   │ │   │  │
│  │  │  │ delay: 0s    │  │ delay: -2s   │  │ delay: -4s   │ │   │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │  │
│  │  │           ↓                ↓                ↓         │   │  │
│  │  │         [Continuous morphing animation]              │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Cursor Trail (#cursor-trail)                          │   │  │
│  │  │ [Dynamic drip elements created/destroyed here]        │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## CSS Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CSS Styling System                               │
│                    (style_updated.css)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Base Cursor Styles                                           │  │
│  │ • Hide default cursor (cursor: none !important)              │  │
│  │ • Container: fixed, full viewport, z-index: 10000            │  │
│  │ • Cursor: 60px × 60px base size                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Blob Morphing Animation (blobMorph - 6s cycle)               │  │
│  │                                                               │  │
│  │   0%:   border-radius: 60% 40% / 30% 70%  rotate: 0°         │  │
│  │   20%:  border-radius: 40% 60% / 50% 60%  rotate: 72°        │  │
│  │   40%:  border-radius: 70% 30% / 60% 40%  rotate: 144°       │  │
│  │   60%:  border-radius: 30% 70% / 40% 60%  rotate: 216°       │  │
│  │   80%:  border-radius: 50% 50% / 70% 30%  rotate: 288°       │  │
│  │   100%: return to start                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ State Transitions                                            │  │
│  │                                                               │  │
│  │  .hover-active                                               │  │
│  │  • Size: 60px → 100px                                        │  │
│  │  • Color: Blue gradient → Dynamic element color              │  │
│  │  • Animation: blobMorph (6s) → blobMorphFast (2s)           │  │
│  │                                                               │  │
│  │  .click-active                                               │  │
│  │  • Animation: cursorPulse (0.3s)                             │  │
│  │  • Scale: 1.0 → 1.3 → 1.0                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Drip Trail Animation (dripFall - 1.5s)                       │  │
│  │                                                               │  │
│  │  • translateY: 0 → 100px                                     │  │
│  │  • scale: 1.0 → 0.3                                          │  │
│  │  • opacity: 1.0 → 0.0                                        │  │
│  │  • Auto-cleanup after animation                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Responsive Behavior                                          │  │
│  │                                                               │  │
│  │  @media (hover: none) and (pointer: coarse)                  │  │
│  │  • Display: none (hide cursor)                               │  │
│  │  • Restore default cursor                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## JavaScript Class Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                MagneticBlobCursor Class                              │
│                    (script.js)                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Properties                                                   │  │
│  │ ┌────────────────────────────────────────────────────────┐   │  │
│  │ │ Position State                                         │   │  │
│  │ │ • cursorX, cursorY (target position)                   │   │  │
│  │ │ • currentX, currentY (actual position)                 │   │  │
│  │ │ • velocityX, velocityY (movement speed)                │   │  │
│  │ └────────────────────────────────────────────────────────┘   │  │
│  │ ┌────────────────────────────────────────────────────────┐   │  │
│  │ │ Physics Parameters                                     │   │  │
│  │ │ • friction: 0.15 (smoothing)                           │   │  │
│  │ │ • magneticFriction: 0.25 (faster when magnetic)        │   │  │
│  │ │ • magneticStrength: 0.4 (pull intensity)               │   │  │
│  │ └────────────────────────────────────────────────────────┘   │  │
│  │ ┌────────────────────────────────────────────────────────┐   │  │
│  │ │ Element Tracking                                       │   │  │
│  │ │ • magneticElements[] (all interactive elements)        │   │  │
│  │ │ • Each contains: element, rect, color                  │   │  │
│  │ └────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Core Methods                                                 │  │
│  │                                                               │  │
│  │  init()                                                       │  │
│  │  ├─ Get DOM elements                                          │  │
│  │  ├─ setupEventListeners()                                     │  │
│  │  ├─ initMagneticElements()                                    │  │
│  │  └─ animate() (start RAF loop)                                │  │
│  │                                                               │  │
│  │  setupEventListeners()                                        │  │
│  │  ├─ mousemove → checkMagneticAttraction()                     │  │
│  │  ├─ mousedown → click animation                               │  │
│  │  ├─ scroll → updateMagneticPositions()                        │  │
│  │  └─ resize → re-initialize                                    │  │
│  │                                                               │  │
│  │  initMagneticElements()                                       │  │
│  │  ├─ Query all interactive elements                            │  │
│  │  ├─ Store rect and color for each                             │  │
│  │  ├─ Add hover listeners (color change)                        │  │
│  │  └─ Add size change on hover                                  │  │
│  │                                                               │  │
│  │  checkMagneticAttraction()                                    │  │
│  │  ├─ Calculate distance to each element                        │  │
│  │  ├─ Find closest within magnetic radius                       │  │
│  │  ├─ Calculate pull strength (1 - distance/radius)             │  │
│  │  └─ Apply pull force to cursor position                       │  │
│  │                                                               │  │
│  │  createDrip(x, y)                                             │  │
│  │  ├─ Check throttle (150ms intervals)                          │  │
│  │  ├─ Create drip element                                       │  │
│  │  ├─ Add to trail container                                    │  │
│  │  └─ Auto-remove after 1.5s                                    │  │
│  │                                                               │  │
│  │  animate() [RAF Loop]                                         │  │
│  │  ├─ Calculate velocity (delta position)                       │  │
│  │  ├─ Apply friction (different for magnetic state)             │  │
│  │  ├─ Update position with smoothing                            │  │
│  │  ├─ Check speed for drip creation                             │  │
│  │  ├─ Apply rotation based on velocity                          │  │
│  │  └─ requestAnimationFrame(animate)                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│ Mouse Move  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────┐
│ Update cursor target position (cursorX, Y)  │
└──────┬──────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────────┐
│ checkMagneticAttraction()                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ For each magnetic element:                       │ │
│ │   • Calculate distance to cursor                 │ │
│ │   • If within magnetic radius:                   │ │
│ │     - Calculate pull strength                    │ │
│ │     - Apply offset to cursorX/Y                  │ │
│ └──────────────────────────────────────────────────┘ │
└──────┬───────────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────────┐
│ animate() [RAF Loop - 60fps]                         │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 1. Calculate velocity (cursorX - currentX)       │ │
│ │ 2. Apply friction to velocity                    │ │
│ │ 3. Update current position                       │ │
│ │ 4. Check speed for drip creation                 │ │
│ │ 5. Update DOM position (left/top)                │ │
│ │ 6. Apply rotation transform                      │ │
│ └──────────────────────────────────────────────────┘ │
└──────┬───────────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ Browser Render                │
│ • CSS animations (morphing)   │
│ • SVG filter (gooey effect)   │
│ • Transform updates           │
└───────────────────────────────┘
```

## Event Flow

```
User Actions                 System Response
═══════════                 ════════════════

Move Mouse   ────────────►  Update target position
                           Apply magnetic pull
                           Smooth follow with physics

Hover Element ───────────►  Add .hover-active class
                           Grow to 100px
                           Change color
                           Speed up morphing

Leave Element ───────────►  Remove .hover-active
                           Shrink to 60px
                           Reset color
                           Normal morphing speed

Click        ────────────►  Add .click-active class
                           Trigger pulse animation
                           Remove after 300ms

Fast Movement ───────────►  Check velocity
                           Random drip creation
                           Animated fall effect
                           Auto-cleanup

Scroll       ────────────►  Update element positions
                           Recalculate magnetic radii

Resize       ────────────►  Re-query elements
                           Update cached rects
                           Reinitialize tracking
```

## Color Mapping Flow

```
Element Type Detection
        ↓
┌──────────────────────────────────────────┐
│ getElementColor(element)                 │
├──────────────────────────────────────────┤
│                                          │
│  Has .btn-primary? ──Yes──► rgba(96, 211, 148, 0.9)
│        │                               [Green]
│       No
│        │
│  Has .btn-secondary? ─Yes──► rgba(255, 155, 133, 0.9)
│        │                               [Orange]
│       No
│        │
│  Has .tag? ──────────Yes──► rgba(192, 132, 252, 0.9)
│        │                               [Purple]
│       No
│        │
│  Default ─────────────────► rgba(167, 139, 250, 0.9)
│                                      [Purple-Blue]
└──────────────────────────────────────────┘
        ↓
Apply to all 3 blob layers
        ↓
Smooth gradient transition (CSS)
```

## Performance Optimization Points

```
1. Event Throttling
   • Drip creation: Max every 150ms
   • Position updates: requestAnimationFrame only

2. Element Caching
   • Store bounding rects in array
   • Update only on scroll/resize
   • No DOM queries in animation loop

3. Conditional Rendering
   • Only initialize on desktop (hover check)
   • Skip drips based on velocity + random
   • Early exit from magnetic calculations

4. Transform-Only Updates
   • No layout triggering properties
   • Use left/top for position (in RAF)
   • Transform for rotation only

5. Memory Management
   • Auto-remove drip elements after animation
   • Clear completed animations
   • No memory leaks in event listeners
```

## Integration Points

```
Portfolio Components          Cursor Interaction
════════════════════         ═══════════════════

Navigation Links     ────►   Magnetic pull + grow
Buttons (CTA)        ────►   Strong pull + green color
Project Cards        ────►   Large pull radius + morph
Skill Cards          ────►   Medium pull + dynamic color
Blog Cards           ────►   Hover state + purple shift
Tags                 ────►   Small pull + purple color
Social Icons         ────►   Pull + rotation emphasis
Form Inputs          ────►   Precise positioning + grow
Bento Grid Items     ────►   Large interactive area
```

## File Structure

```
/home/user0/niickyg.github.io/
│
├── index.html                  [SVG filter + cursor HTML]
├── style_updated.css           [Cursor styles + animations]
├── script.js                   [MagneticBlobCursor class]
│
├── CURSOR_IMPLEMENTATION.md    [Technical documentation]
├── CURSOR_ARCHITECTURE.md      [This file - architecture]
├── CURSOR_SUMMARY.md           [Complete summary]
└── CURSOR_DEMO.html            [Standalone demo page]
```

---

**Architecture Version**: 1.0
**Last Updated**: 2025-12-31
**Complexity Level**: Advanced
**Maintainability**: High (well-documented, modular)
