# CLAUDE.md

## Overview
Personal portfolio site for Nicholas Guerriero — showcases businesses (Mountain West Surface, Ski Butlers), side projects (crypto mining, automated trading, homelab), and contact info. Hosted on GitHub Pages with custom domain.

## Stack
- Static HTML/CSS/JS (no build step, no framework)
- Inter font (Google Fonts)
- Three.js for optional 3D hero scene (`hero-3d.js`)
- Brutalist design aesthetic with green (#00FF00) accent color

## Preview / Deploy
- **Preview:** Open `index.html` in a browser, or run `python3 -m http.server` in the project root
- **Deploy:** Push to `main` branch — GitHub Pages auto-deploys to `nickguerriero.com`
- `.nojekyll` present to bypass Jekyll processing

## Key Files
- `index.html` — Main landing page (hero, businesses, projects, about, contact)
- `trading.html` — Automated trading stats page (self-contained styles)
- `trading-data.json` — Trading data consumed by trading page
- `about.html`, `blog.html`, `contact.html`, `homelab.html`, `projects.html` — Subpages
- `style_updated.css` — Global stylesheet (brutalist theme)
- `script.js` — Minimal JS (footer year, smooth scroll)
- `hero-3d.js` — Three.js 3D rocketship scene (unused in current index.html)
- `logo.svg` — Favicon/logo
- `CNAME` — Custom domain: `nickguerriero.com`

## Notes
- `trading.html` uses inline styles rather than the shared stylesheet
- Several backup/demo files exist (`.backup`, `.constellation_backup`, `*-demo.html`) — these are artifacts, not active
- `hero-3d.js` requires Three.js CDN and a `#hero-3d-canvas` element; not wired into current `index.html`
- No build tools, package manager, or dependencies to install
