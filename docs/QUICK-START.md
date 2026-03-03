# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js 14+ installed
- Git installed
- VS Code (recommended) or any code editor

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/seanohtani-dotcom/DOAX.git
cd DOAX

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

You should see:

```
🚀 Venus Vacation PRISM Backend Server running on port 3000
📦 Connected to SQLite database
✅ Database tables created successfully
```

### Step 3: Start Frontend

**Option A: Using Live Server (Recommended)**

1. Install "Live Server" extension in VS Code
2. Right-click `public/index.html`
3. Select "Open with Live Server"
4. Site opens at `http://127.0.0.1:5500/public/`

**Option B: Using Python**

```bash
python -m http.server 8000
```

Then open: `http://localhost:8000/public/`

### Step 4: Explore!

- **Homepage:** `public/index.html`
- **Store:** `public/buy-now.html`
- **Tests:** `tests/test-fixes.html`
- **API:** `http://localhost:3000/api/health`

## 🎨 Development Workflow

### Making Changes

**1. Edit TypeScript:**

```bash
# Edit files in src/ts/
# Then compile:
npx tsc

# Or watch mode:
npx tsc --watch
```

**2. Edit JavaScript:**

```bash
# Edit files in src/js/
# No compilation needed - refresh browser
```

**3. Edit CSS:**

```bash
# Edit files in src/css/
# No compilation needed - refresh browser
```

### Project Structure

```
📂 public/          ← HTML files (start here)
📂 src/
   ├── ts/          ← TypeScript source
   ├── js/          ← JavaScript files
   └── css/         ← Stylesheets
📂 dist/            ← Compiled TypeScript (auto-generated)
📂 assets/img/      ← Images and videos
📂 backend/         ← API server
📂 tests/           ← Test files
📂 docs/            ← Documentation
```

## 🧪 Testing

### Run Tests

Open in browser:

- `tests/test-fixes.html` - Video & cart tests
- `tests/test-api.html` - API tests
- `tests/test-videos.html` - Video playback tests

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get products
curl http://localhost:3000/api/products
```

## 🎯 Common Tasks

### Add a New Product

Edit `backend/database/init.js` in the `seedData()` function:

```javascript
{
  id: '6',
  name: 'New Product',
  price: 29.99,
  category: 'dlc',
  type: 'digital',
  // ...
}
```

### Change API Port

Edit `backend/server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Change 3000
```

### Add New Page

1. Create HTML in `public/`
2. Use paths: `../src/css/`, `../assets/img/`, `../dist/`
3. Link from existing pages

### Customize Design

Edit `src/css/style.css` or `src/css/buy-now.css`

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Or change port in backend/server.js
```

### Frontend not loading

- Ensure backend is running on port 3000
- Check browser console for errors
- Verify file paths are correct

### TypeScript errors

```bash
# Recompile
npx tsc

# Check config
cat tsconfig.json
```

### Images not showing

- Check path: `../assets/img/filename.ext`
- Verify file exists in `assets/img/`
- Check browser console for 404 errors

## 📚 Next Steps

1. **Read Documentation:**
   - [README.md](README.md) - Full overview
   - [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) - File organization
   - [DESIGN-GUIDE.md](DESIGN-GUIDE.md) - Design system
   - [FIXES-APPLIED.md](FIXES-APPLIED.md) - Technical details

2. **Explore Features:**
   - Video player with error handling
   - Shopping cart with persistence
   - Wishlist system
   - Checkout flow

3. **Customize:**
   - Change colors in CSS
   - Add new products
   - Modify layouts
   - Add features

## 🎓 Learning Resources

- **TypeScript:** Check `src/ts/` for examples
- **Modern CSS:** Check `src/css/` for techniques
- **REST API:** Check `backend/routes/` for patterns
- **Vanilla JS:** Check `src/js/` for implementations

## 💡 Tips

- Use VS Code for best experience
- Enable Auto Save in editor
- Use browser DevTools for debugging
- Check console for errors
- Use `npx tsc --watch` during development

## 🆘 Getting Help

1. Check browser console for errors
2. Check backend terminal for logs
3. Review documentation in `docs/`
4. Check [FIXES-APPLIED.md](FIXES-APPLIED.md) for technical details

---

**Happy Coding! 🎉**

Need more help? Check the full [README.md](README.md) or [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md).
