# 3D Cup Visualization

Interactive 3D cup visualization system with texture mapping using Three.js and Vite.

## Features

- 🎨 **Interactive 3D Rendering** - Rotate and zoom the 3D cup with mouse controls
- 🖼️ **Custom Texture Upload** - Upload any image to wrap around the cup
- 🎯 **Optimized Performance** - Proper memory management and resource cleanup
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast Development** - Built with Vite for instant HMR

## Live Demo

Visit the live demo: [https://YOUR_USERNAME.github.io/cylinder/](https://YOUR_USERNAME.github.io/cylinder/)

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cylinder.git
cd cylinder

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **View the Cup** - The 3D cup loads with a default QR code texture
2. **Rotate** - Click and drag to rotate the view
3. **Zoom** - Use mouse wheel to zoom in/out
4. **Upload Image** - Click "Upload Image" button to apply your own texture
5. **Supported Formats** - JPG, PNG, GIF, WebP (max 10MB)

## Technical Details

### Technologies

- **Three.js** - 3D graphics library
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - No framework dependencies

### Cup Specifications

- Height: 1.75 units
- Radius: 1.0 units
- Handle: Half-torus geometry attached to cylinder
- Texture: Wraps twice around circumference (each image occupies 180°)

### Code Quality

- ✅ No code duplication
- ✅ Proper memory management (texture disposal)
- ✅ Loading state management
- ✅ Error handling with user feedback
- ✅ File validation (type and size)

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages on every push to the `master` or `main` branch.

### Setup Instructions

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to trigger deployment**:
   ```bash
   git push origin master
   ```

3. **Access your site** at:
   `https://YOUR_USERNAME.github.io/cylinder/`

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Install dependencies
- Build the project with Vite
- Deploy to GitHub Pages automatically

## Project Structure

```
cylinder/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── plans/                      # Documentation and planning
│   ├── code-review-findings.md
│   └── code-fix-architecture.md
├── index.html                  # Main HTML file
├── main.js                     # Three.js application (240 lines)
├── styles.css                  # Stylesheet
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies
├── qr_bit_pattern_ascii.png   # Default texture
└── README.md                  # This file
```

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Three.js](https://threejs.org/)
- Powered by [Vite](https://vitejs.dev/)
