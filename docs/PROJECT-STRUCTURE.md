# Venus Vacation PRISM - Project Structure

## 📁 Organized Directory Structure

```
DOAX/
├── 📂 public/                    # Public HTML files
│   ├── index.html               # Main homepage
│   └── buy-now.html             # Store/shopping page
│
├── 📂 src/                       # Source code
│   ├── 📂 ts/                   # TypeScript source files
│   │   ├── video-player.ts     # Video player module
│   │   ├── cart-manager.ts     # Shopping cart module
│   │   └── global.d.ts         # Global type declarations
│   │
│   ├── 📂 js/                   # JavaScript files
│   │   ├── script.js           # Main application script
│   │   ├── buy-now.js          # E-commerce functionality
│   │   └── design-enhancements.js  # UI interactions
│   │
│   └── 📂 css/                  # Stylesheets
│       ├── style.css           # Main styles
│       └── buy-now.css         # E-commerce styles
│
├── 📂 dist/                      # Compiled TypeScript output
│   ├── video-player.js         # Compiled video player
│   ├── video-player.d.ts       # Type declarations
│   ├── cart-manager.js         # Compiled cart manager
│   ├── cart-manager.d.ts       # Type declarations
│   └── *.js.map                # Source maps
│
├── 📂 assets/                    # Static assets
│   └── 📂 img/                  # Images and videos
│       ├── *.webp              # Product images
│       ├── *.jpg               # Character images
│       ├── *.svg               # Logo files
│       └── *.mp4               # Video trailers
│
├── 📂 backend/                   # Backend API
│   ├── 📂 routes/               # API routes
│   │   ├── auth.js             # Authentication
│   │   ├── products.js         # Product management
│   │   ├── orders.js           # Order processing
│   │   ├── payments.js         # Payment handling
│   │   ├── wishlist.js         # Wishlist management
│   │   └── admin.js            # Admin functions
│   │
│   ├── 📂 database/             # Database setup
│   │   └── init.js             # Database initialization
│   │
│   ├── server.js               # Express server
│   ├── database.sqlite         # SQLite database
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variables template
│
├── 📂 tests/                     # Test files
│   ├── test-fixes.html         # Video & cart tests
│   ├── test-api.html           # API integration tests
│   ├── test-videos.html        # Video playback tests
│   └── test-wishlist-fix.html  # Wishlist tests
│
├── 📂 docs/                      # Documentation
│   ├── README.md               # Project overview
│   ├── CHANGELOG.md            # Version history
│   ├── FIXES-APPLIED.md        # Technical fixes documentation
│   ├── DESIGN-GUIDE.md         # Design system guide
│   └── PROJECT-STRUCTURE.md    # This file
│
├── 📂 .vscode/                   # VS Code configuration
│   ├── settings.json           # Editor settings
│   ├── launch.json             # Debug configuration
│   ├── tasks.json              # Build tasks
│   └── extensions.json         # Recommended extensions
│
├── 📂 node_modules/              # Dependencies (gitignored)
│
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 package.json               # Project dependencies
├── 📄 package-lock.json          # Dependency lock file
├── 📄 .gitignore                 # Git ignore rules
└── 📄 doa.code-workspace         # VS Code workspace
```

## 📋 File Organization Principles

### 1. Separation of Concerns

- **public/** - User-facing HTML files
- **src/** - Source code organized by type
- **dist/** - Compiled/built files
- **assets/** - Static resources
- **backend/** - Server-side code
- **tests/** - Testing files
- **docs/** - Documentation

### 2. Source Code Structure

```
src/
├── ts/     # TypeScript source (compiled to dist/)
├── js/     # JavaScript files (used directly)
└── css/    # Stylesheets (used directly)
```

### 3. Asset Management

```
assets/
└── img/    # All images and videos in one place
```

### 4. Documentation

```
docs/
├── README.md              # Getting started
├── CHANGELOG.md           # What changed
├── FIXES-APPLIED.md       # Technical details
├── DESIGN-GUIDE.md        # Design system
└── PROJECT-STRUCTURE.md   # This file
```

## 🔗 Path References

### From public/index.html

```html
<!-- CSS -->
<link rel="stylesheet" href="../src/css/style.css" />
<link rel="stylesheet" href="../src/css/buy-now.css" />

<!-- Images -->
<img src="../assets/img/logo.webp" />

<!-- Scripts -->
<script type="module" src="../dist/video-player.js"></script>
<script src="../src/js/script.js"></script>
```

### From tests/test-fixes.html

```html
<!-- Scripts -->
<script type="module" src="../dist/video-player.js"></script>

<!-- Images -->
<img src="../assets/img/first-trailer.mp4" />
```

### From src/js/buy-now.js

```javascript
// API calls
const apiUrl = "http://localhost:3000/api";

// Image references (relative to HTML file)
const imageUrl = "../assets/img/product.webp";
```

## 🚀 Build Process

### TypeScript Compilation

```bash
# Compile TypeScript files
npx tsc

# Watch mode
npx tsc --watch

# Input:  src/ts/*.ts
# Output: dist/*.js + dist/*.d.ts + dist/*.js.map
```

### Development Workflow

1. Edit TypeScript files in `src/ts/`
2. Run `npx tsc` to compile
3. Compiled files appear in `dist/`
4. HTML files in `public/` reference compiled files

## 📦 Dependencies

### Frontend Dependencies

- TypeScript (dev)
- @types/node (dev)

### Backend Dependencies

- express
- cors
- sqlite3
- bcrypt
- jsonwebtoken
- uuid
- dotenv

## 🎯 Key Files

### Entry Points

- `public/index.html` - Main website
- `public/buy-now.html` - Store page
- `backend/server.js` - API server

### Core Modules

- `src/ts/video-player.ts` - Video functionality
- `src/ts/cart-manager.ts` - Shopping cart
- `src/js/script.js` - Main interactions
- `src/js/design-enhancements.js` - UI polish

### Configuration

- `tsconfig.json` - TypeScript settings
- `package.json` - Project metadata
- `backend/.env` - Environment variables

## 🔧 Maintenance

### Adding New Features

1. Create TypeScript file in `src/ts/`
2. Compile with `npx tsc`
3. Reference compiled file from HTML
4. Update this documentation

### Adding New Pages

1. Create HTML file in `public/`
2. Use relative paths: `../src/css/`, `../assets/img/`
3. Reference compiled scripts from `../dist/`

### Adding New Assets

1. Place in `assets/img/`
2. Reference as `../assets/img/filename.ext` from public/
3. Reference as `../../assets/img/filename.ext` from tests/

## 📊 File Count Summary

- **HTML Files:** 6 (2 public, 4 tests)
- **TypeScript Files:** 3 (src/ts/)
- **JavaScript Files:** 3 (src/js/)
- **CSS Files:** 2 (src/css/)
- **Documentation:** 5 (docs/)
- **Backend Routes:** 6 (backend/routes/)
- **Total Lines of Code:** ~15,000+

## 🎨 Design Assets

### Images

- Product images: `.webp` format
- Character images: `.jpg` format
- Logos: `.svg` format
- Videos: `.mp4` format

### Fonts

- Primary: Poppins (Google Fonts)
- Fallback: System fonts

## 🔐 Security

### Excluded from Git

- `node_modules/`
- `backend/.env`
- `backend/database.sqlite`
- `*.log`
- `.DS_Store`

### Included in Git

- Source code (`src/`)
- Public files (`public/`)
- Documentation (`docs/`)
- Configuration files
- `.env.example` (template)

## 📱 Deployment

### Frontend Deployment

1. Upload `public/`, `src/`, `dist/`, `assets/` to web server
2. Ensure relative paths work correctly
3. Configure web server to serve `public/index.html` as root

### Backend Deployment

1. Upload `backend/` folder
2. Set environment variables
3. Run `npm install` in backend folder
4. Start with `npm start`

## 🎓 Learning Resources

- TypeScript: `src/ts/` - See type-safe implementations
- Modern CSS: `src/css/` - Glassmorphism, animations
- Vanilla JS: `src/js/` - No framework patterns
- REST API: `backend/routes/` - Express.js patterns

---

**Last Updated:** March 3, 2026  
**Structure Version:** 2.0.0  
**Maintained by:** Venus Vacation PRISM Team
