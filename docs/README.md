# Venus Vacation PRISM - E-Commerce Platform

A full-stack TypeScript-powered e-commerce platform for the Venus Vacation PRISM game, featuring advanced video playback, shopping cart functionality, product browsing, wishlist management, and a complete checkout system.

![Venus Vacation PRISM](img/logo.webp)

## 🌟 Features

- **🎬 Advanced Video Player** - TypeScript-based player with error handling and accessibility
- **🛒 Smart Shopping Cart** - Type-safe cart with localStorage persistence
- **📦 Product Catalog** - Browse games, DLC, and digital content
- **💖 Wishlist System** - Save items for later with persistent storage
- **💳 Checkout Flow** - 3-step checkout process (Shipping → Payment → Confirmation)
- **📊 Order Management** - Track orders and payment status
- **🎨 Responsive Design** - Works on desktop and mobile devices

## 📋 Recent Updates (2026-03-03)

### ✅ Video Player Fix

- Implemented TypeScript-based video player with strict typing
- Added comprehensive error handling for playback failures
- Browser autoplay restriction handling
- Keyboard accessibility (Space/Enter keys)
- Cross-browser compatibility tested

### ✅ Add-to-Cart Fix

- Implemented TypeScript cart manager with strict `CartItem` interface
- Input validation (quantity 1-10, price validation)
- localStorage persistence with error recovery
- Reactive UI updates with observer pattern
- Toast notifications for user feedback

**See [FIXES-APPLIED.md](FIXES-APPLIED.md) for detailed technical documentation.**

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- VS Code (recommended) or any code editor
- Live Server extension for VS Code

### Installation

1. **Clone or download this repository**

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server:**

   ```bash
   node server.js
   ```

   You should see:

   ```
   🚀 Venus Vacation PRISM Backend Server running on port 3000
   ```

4. **Start the frontend:**
   - Open `index.html` with Live Server in VS Code
   - Or open `index.html` in your browser

5. **Access the application:**
   - Frontend: `http://127.0.0.1:5501/index.html`
   - Backend API: `http://localhost:3000/api`

## 📖 Documentation

- **[VS Code Setup Guide](VS_CODE_SETUP.md)** - Complete setup instructions for VS Code
- **[Implementation Summary](IMPLEMENTATION-SUMMARY.md)** - Technical implementation details
- **[Setup Guide](setup.md)** - General setup instructions

## 🏗️ Tech Stack

### Frontend

- HTML5, CSS3, JavaScript (ES6+)
- Vanilla JavaScript (no frameworks)
- Responsive design with CSS Grid and Flexbox
- LocalStorage for session management

### Backend

- Node.js with Express.js
- SQLite database
- RESTful API architecture
- CORS enabled for local development

## 📁 Project Structure

```
DOAX/
├── public/          # HTML pages
├── src/
│   ├── ts/         # TypeScript source
│   ├── js/         # JavaScript files
│   └── css/        # Stylesheets
├── dist/           # Compiled TypeScript
├── assets/img/     # Images & videos
├── backend/        # API server
├── tests/          # Test files
└── docs/           # Documentation
```

See [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) for detailed structure.

## 🎮 Usage

### Browse Products

- Scroll through the homepage to see available products
- Click "Buy Now" or "View Details" to see product information

### Add to Wishlist

1. Click on any product to open the modal
2. Click "Add to Wishlist" (heart icon)
3. View your wishlist by clicking the wishlist icon in the header

### Purchase Products

1. Click "Buy Now" on any product
2. Select quantity
3. Click "Buy Now" in the modal
4. Fill in shipping information
5. Enter payment details
6. Review and confirm your order
7. Complete the purchase

## 🔌 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Wishlist

- `GET /api/wishlist?sessionId=xxx` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

### Payments

- `POST /api/payments/process` - Process payment

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get products
curl http://localhost:3000/api/products
```

### Browser Console

```javascript
// Test store initialization
console.log(store);

// Test product loading
console.log(store.products);

// Test wishlist
store.addToWishlist("1");
```

## 🐛 Troubleshooting

### Backend Issues

- **Port already in use**: Change port in `backend/server.js`
- **Module not found**: Run `npm install` in backend folder
- **Database errors**: Delete `database.sqlite` and restart server

### Frontend Issues

- **CORS errors**: Ensure backend is running on port 3000
- **Products not loading**: Check backend is running and accessible
- **Live Server not working**: Install Live Server extension in VS Code

## 🔧 Configuration

### Backend Configuration

Edit `backend/server.js` to change:

- Port number (default: 3000)
- CORS origins
- Database path

### Frontend Configuration

Edit `buy-now.js` to change:

- API URL (default: http://localhost:3000/api)
- Tax rate (default: 8%)
- Shipping cost (default: $9.99)

## 📝 Development

### Adding New Products

Edit `backend/database/init.js` and add products to the `seedData()` function.

### Modifying Styles

- Main styles: `style.css`
- E-commerce styles: `buy-now.css`

### Adding API Routes

Create new route files in `backend/routes/` and register them in `backend/server.js`.

## 🚀 Deployment

### Backend Deployment

1. Set environment variables
2. Use a production database (PostgreSQL, MySQL)
3. Enable HTTPS
4. Set up proper authentication

### Frontend Deployment

1. Update API URL in `buy-now.js`
2. Optimize images
3. Minify CSS/JS files
4. Deploy to hosting service (Netlify, Vercel, etc.)

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Contact

For questions or support, please open an issue on the repository.

---

**Built with ❤️ for Venus Vacation PRISM fans**

## 🎮 New TypeScript Features

### Video Player API

```javascript
// Play video
await videoPlayer.play("video-0");

// Pause video
videoPlayer.pause("video-0");

// Toggle play/pause
await videoPlayer.togglePlayPause("video-0");

// Get video element
const video = videoPlayer.getVideo("video-0");

// Register error handler
videoPlayer.onError("video-0", (error) => {
  console.error("Video error:", error);
});
```

### Cart Manager API

```javascript
// Add item to cart
await cartManager.addItem({
  id: "123",
  name: "Product Name",
  price: 59.99,
  quantity: 1,
});

// Remove item
await cartManager.removeItem("123");

// Update quantity
await cartManager.updateQuantity("123", 3);

// Get cart state
const state = cartManager.getState();
console.log(state.items, state.total, state.itemCount);

// Subscribe to changes
const unsubscribe = cartManager.subscribe((state) => {
  console.log("Cart updated:", state);
});

// Clear cart
await cartManager.clearCart();
```

## 🧪 Testing

### Run Test Suite

Open `test-fixes.html` in your browser to run comprehensive tests:

- ✅ Video player functionality
- ✅ Cart manager operations
- ✅ Error handling
- ✅ Persistence tests
- ✅ Edge case validation

### Manual Testing

```bash
# Test Backend API
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products

# Browser Console
console.log(videoPlayer);
console.log(cartManager);
```

## 🔧 TypeScript Development

### Compile TypeScript

```bash
npx tsc
```

### Watch Mode

```bash
npx tsc --watch
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📱 Browser Compatibility

| Browser       | Version | Video | Cart | Status            |
| ------------- | ------- | ----- | ---- | ----------------- |
| Chrome        | 90+     | ✅    | ✅   | Fully supported   |
| Firefox       | 88+     | ✅    | ✅   | Fully supported   |
| Safari        | 14+     | ✅    | ✅   | Fully supported   |
| Edge          | 90+     | ✅    | ✅   | Fully supported   |
| iOS Safari    | 14+     | ✅    | ✅   | Touch events work |
| Chrome Mobile | 90+     | ✅    | ✅   | Fully supported   |

## 📚 Additional Documentation

- **[FIXES-APPLIED.md](FIXES-APPLIED.md)** - Detailed technical documentation of video and cart fixes
- **[VS Code Setup Guide](VS_CODE_SETUP.md)** - Complete setup instructions for VS Code
- **[Implementation Summary](IMPLEMENTATION-SUMMARY.md)** - Technical implementation details

---

**Last Updated:** March 3, 2026 | **Version:** 1.0.0 | **Built with ❤️ and TypeScript**
