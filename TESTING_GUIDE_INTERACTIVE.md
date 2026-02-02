# Interactive Experience - Testing Guide

## Quick Testing Checklist

### 1. Scroll Progress Indicator (Top of Page)
**What to see:**
- Thin colored bar at the very top of the page
- As you scroll down, bar fills from left to right
- Bar changes color as you move through different sections

**Test:**
1. Load the page
2. Slowly scroll down
3. Watch the top edge - you should see a 4px colored bar growing
4. Notice color changes: green → amber → terracotta as you scroll

---

### 2. Number Blocks (By the Numbers Section)
**What to see:**
- Progress bars at the bottom of each number block
- Bars fill when you scroll to that section
- Tooltips appear on hover

**Test:**
1. Scroll to "By the Numbers" section
2. Watch the bottom of each number block - progress bars should fill
3. Hover over a number block - tooltip should appear above it
4. Numbers should have a subtle pulse animation

**Expected Tooltips:**
- **730 Days:** "Founded in early 2023, Mountain West Surface has been..."
- **2 Businesses:** "Mountain West Surface and Ski Butlers..."
- **4 Years:** "Building and leading teams..."
- **3 Projects:** "Cryptocurrency mining, automated trading..."

---

### 3. Hero Split Effect
**What to see:**
- As you scroll down from the top, the hero text shrinks and moves up
- Text becomes more transparent
- Smooth animation tied to scroll position

**Test:**
1. Refresh page (scroll to top)
2. Slowly scroll down
3. Watch "I build things that make money" - it should:
   - Get smaller (scale down to 80%)
   - Move up the page
   - Become slightly transparent

---

### 4. Project Cards Flip
**What to see:**
- Click a project card to flip it 180°
- Back of card shows detailed information
- Click again to flip back

**Test:**
1. Scroll to "Always Building Something"
2. Click on the "Cryptocurrency Mining" card
3. Card should flip to reveal:
   - "Mining Details"
   - Custom built mining rigs...
   - Focus on energy efficiency...
   - etc.
4. Click again to flip back

**Keyboard Test:**
- Press Tab until a card is focused (blue glow)
- Press Enter or Space to flip
- Should work the same as clicking

**All 4 Cards Should Flip:**
- Crypto → Mining Details
- Trading → Trading Strategy
- Homelab → Homelab Stack
- Ski Butlers → Ski Season Stats

---

### 5. Magnetic Buttons
**What to see:**
- CTA buttons in "What's Next" section are attracted to your cursor
- Ripple effect when clicked
- Confetti when email button clicked

**Test:**
1. Scroll to "What's Next?" section
2. Move your cursor near the "Email Me" button (don't click yet)
3. Button should slightly move toward your cursor
4. Click the button
5. Should see:
   - Ripple effect spreading from click point
   - Confetti particles falling from top of screen (email only)

---

### 6. Mouse Parallax
**What to see:**
- Hero text and images move subtly as you move your mouse
- Creates depth effect

**Test:**
1. Scroll to top (hero section)
2. Move your mouse around the screen
3. "I build things that make money" should move slightly opposite to cursor
4. Same effect on business and person images

**Note:** Desktop only - won't work on mobile

---

### 7. Konami Code Easter Egg
**What to do:**
Press this sequence on your keyboard:
```
↑ ↑ ↓ ↓ ← → ← → B A
```

**What to see:**
- Full-screen terminal overlay appears
- ASCII art logo
- Pre-populated terminal commands:
  - whoami
  - ls -la skills/
  - cat contact.txt
  - echo $MOTIVATION

**Test:**
1. Press the arrow keys and letters in sequence
2. Terminal should appear with dark background
3. Click the X button or press Escape to close
4. Click outside the terminal to close

---

### 8. Console Messages
**What to see:**
Hidden messages for developers in browser console

**Test:**
1. Open browser DevTools (F12 or right-click → Inspect)
2. Go to Console tab
3. Refresh the page
4. Should see styled messages:
   - "👋 Hey there, curious developer!"
   - "If you're reading this, we should talk."
   - "nick@mountainwestsurface.com"
   - "Try the Konami code: ↑↑↓↓←→←→BA"

---

### 9. Click Counter Achievement
**What to do:**
Click anywhere on the page 100 times

**What to see:**
- Achievement badge appears in center of screen:
  - "🏆 Achievement Unlocked! 🏆"
  - "You really like clicking, huh?"
  - "100 clicks reached!"

**Test:**
1. Click rapidly anywhere on the page
2. Keep clicking until you reach 100 clicks
3. Achievement badge should pop up with scale animation
4. Badge auto-dismisses after 3 seconds

---

### 10. Hover Secrets

#### Nav Logo Secret
**Test:**
1. Hover over the logo in the top-left corner
2. Keep hovering for 3 full seconds
3. Message should appear: "Still here? 👀"

#### Footer Secret
**Test:**
1. Scroll to the bottom of the page
2. Click on the copyright text "© 2026 Nicholas Guerriero"
3. Should see build timestamp appear

---

## Mobile Testing

On mobile devices (or resize browser to < 768px):

### Should Be Disabled:
- ❌ Mouse parallax effects
- ❌ Magnetic buttons
- ❌ Complex scroll animations

### Should Still Work:
- ✅ Scroll progress indicator
- ✅ Number progress bars
- ✅ Card flipping (tap instead of click)
- ✅ Basic scroll reveals
- ✅ Konami code (if you have a keyboard)
- ✅ Click counter
- ✅ Tooltips (tap to show)

**Test:**
1. Resize browser to phone size (< 768px)
2. Scroll through page
3. Tap a project card - should still flip
4. Tap and hold a number block - tooltip appears

---

## Accessibility Testing

### Reduced Motion
**Test:**
1. Enable "Reduce Motion" in your OS settings:
   - **macOS:** System Preferences → Accessibility → Display → Reduce Motion
   - **Windows:** Settings → Ease of Access → Display → Show animations
2. Refresh the page
3. All animations should be disabled or instant

### Keyboard Navigation
**Test:**
1. Press Tab repeatedly to move through interactive elements
2. Elements should show visible focus states (glowing outlines)
3. Press Enter or Space on focused elements to activate them
4. Should work on:
   - Navigation links
   - Theme toggle
   - Project cards (flip on Enter/Space)
   - CTA buttons

### Screen Reader
**Test:**
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate through the page
3. Interactive elements should have clear labels
4. Cards should announce "Click to flip card" / "Click to flip back"

---

## Performance Testing

### Smooth Scrolling
**What to check:**
- Scroll should feel smooth at 60fps
- No jank or stuttering
- Animations should be fluid

**Test:**
1. Open DevTools → Performance tab
2. Start recording
3. Scroll through entire page
4. Stop recording
5. Check frame rate - should be mostly green (60fps)

### Load Time
**What to check:**
- Page should load in under 3 seconds
- No layout shift

**Test:**
1. Open DevTools → Network tab
2. Refresh page (with cache disabled)
3. Check DOMContentLoaded time
4. Should be < 1 second

---

## Common Issues & Solutions

### Issue: Progress bar not showing
**Solution:** Make sure the scroll-progress div is present in HTML

### Issue: Cards not flipping
**Solution:** Check that GSAP is loaded (CDN links in <head>)

### Issue: Terminal doesn't appear
**Solution:** Make sure you're pressing keys in exact order: ↑↑↓↓←→←→BA

### Issue: Mouse parallax not working
**Solution:** Check if you're on mobile or have prefers-reduced-motion enabled

### Issue: No animations at all
**Solution:** Check console for JavaScript errors, ensure GSAP CDN is accessible

---

## Expected File Sizes

- **index.html:** ~11.4 KB
- **style_updated.css:** ~85.8 KB
- **script.js:** ~86.9 KB

Total page weight (excluding images): ~184 KB

---

## Browser Compatibility

### Tested & Supported:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features:
- CSS transforms and transitions
- ES6 classes
- IntersectionObserver API
- GSAP 3.12.5 (loaded via CDN)

---

## Quick Visual Checklist

Walk through the page and check:

1. **Top of page** - See progress bar?
2. **Hero section** - Text shrinks on scroll?
3. **Business section** - Highlights fade in?
4. **Numbers section** - Progress bars fill?
5. **Projects section** - Cards flip on click?
6. **Person section** - Parallax on scroll?
7. **Connect section** - Buttons magnetic?
8. **Console** - Messages appear?
9. **Konami code** - Terminal works?
10. **100 clicks** - Achievement badge?

If all 10 work → **🎉 Implementation is successful!**

---

## Final Verification

The site should feel like you're exploring a video game level, not reading a resume. If users are:

- ✅ Scrolling slowly to watch animations
- ✅ Hovering to discover tooltips
- ✅ Clicking cards to see what's inside
- ✅ Trying the Konami code
- ✅ Spending 3-5 minutes instead of 30 seconds

**Then the interactive experience is working as designed.** 🚀
