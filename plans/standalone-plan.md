# Standalone Single-File Implementation Plan

## Goal
Create a self-contained HTML file that runs the 3D Cup Visualization without npm, build tools, or external files (except CDN for Three.js).

## Architecture

### Current Structure
```
index.html → styles.css
           → main.js (imports from node_modules)
           → qr_bit_pattern_ascii.png
```

### New Standalone Structure
```
standalone.html
  ├── <style> (inlined CSS)
  ├── <script type="importmap"> (CDN mapping)
  ├── <script type="module"> (inlined JS)
  └── data:image/png;base64,... (embedded QR)
```

## Implementation Steps

### 1. Convert QR Image to Base64
- Read [`qr_bit_pattern_ascii.png`](../qr_bit_pattern_ascii.png)
- Convert to base64 data URL
- Embed in HTML

### 2. Setup CDN Import Map
Replace npm imports with CDN:
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}
</script>
```

### 3. Inline CSS
- Extract clean CSS from [`styles.css`](../styles.css)
- Remove duplicates
- Place in `<style>` tag

### 4. Inline JavaScript
- Copy code from [`main.js`](../main.js)
- Replace image path with base64 data URL
- Place in `<script type="module">` tag

### 5. Create Standalone File
Combine all components into `standalone.html`

### 6. Test in Browser
- Open file directly in browser
- Verify 3D rendering works
- Test image upload functionality
- Check responsive design

### 7. Create Documentation
- Usage instructions
- Browser requirements
- Troubleshooting guide

## Browser Requirements
- Chrome/Edge 89+
- Firefox 108+
- Safari 16.4+
- WebGL support
- ES6 modules support
- Import maps support

## Success Criteria
✅ Single HTML file works without external files  
✅ All functionality preserved  
✅ File size under 50 KB  
✅ No console errors  
✅ Works in modern browsers  

## Deliverables
- `standalone.html` - Main deliverable
- `README-standalone.md` - Usage documentation

## Goal
Create a self-contained HTML file that runs the 3D Cup Visualization without npm, build tools, or external files (except CDN for Three.js).

## Architecture

### Current Structure
```
index.html → styles.css
           → main.js (imports from node_modules)
           → qr_bit_pattern_ascii.png
```

### New Standalone Structure
```
standalone.html
  ├── <style> (inlined CSS)
  ├── <script type="importmap"> (CDN mapping)
  ├── <script type="module"> (inlined JS)
  └── data:image/png;base64,... (embedded QR)
```

## Implementation Steps

### 1. Convert QR Image to Base64
- Read [`qr_bit_pattern_ascii.png`](../qr_bit_pattern_ascii.png)
- Convert to base64 data URL
- Embed in HTML

### 2. Setup CDN Import Map
Replace npm imports with CDN:
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}
</script>
```

### 3. Inline CSS
- Extract clean CSS from [`styles.css`](../styles.css)
- Remove duplicates
- Place in `<style>` tag

### 4. Inline JavaScript
- Copy code from [`main.js`](../main.js)
- Replace image path with base64 data URL
- Place in `<script type="module">` tag

### 5. Create Standalone File
Combine all components into `standalone.html`

### 6. Test in Browser
- Open file directly in browser
- Verify 3D rendering works
- Test image upload functionality
- Check responsive design

### 7. Create Documentation
- Usage instructions
- Browser requirements
- Troubleshooting guide

## Browser Requirements
- Chrome/Edge 89+
- Firefox 108+
- Safari 16.4+
- WebGL support
- ES6 modules support
- Import maps support

## Success Criteria
✅ Single HTML file works without external files  
✅ All functionality preserved  
✅ File size under 50 KB  
✅ No console errors  
✅ Works in modern browsers  

## Deliverables
- `standalone.html` - Main deliverable
- `README-standalone.md` - Usage documentation

