# Venus Vacation PRISM - E-Commerce Platform

A full-stack e-commerce platform for the Venus Vacation PRISM game, featuring product browsing, wishlist management, and a complete checkout system.

![Venus Vacation PRISM](img/logo.webp)

## 🌟 Features

- **Product Catalog** - Browse games, DLC, and digital content
- **Wishlist System** - Save items for later with persistent storage
- **Shopping Cart** - Add multiple items and manage quantities
- **Checkout Flow** - 3-step checkout process (Shipping → Payment → Confirmation)
- **Order Management** - Track orders and payment status
- **Admin Dashboard** - View statistics and manage orders
- **Responsive Design** - Works on desktop and mobile devices

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
venus-vacation-prism/
├── backend/              # Backend API
│   ├── database/        # Database setup
│   ├── routes/          # API routes
│   └── server.js        # Express server
├── img/                 # Images and assets
├── .vscode/             # VS Code configuration
├── index.html           # Main page
├── buy-now.js           # E-commerce functionality
├── buy-now.css          # E-commerce styles
├── script.js            # Main scripts
└── style.css            # Main styles
```

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
store.addToWishlist('1');
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
