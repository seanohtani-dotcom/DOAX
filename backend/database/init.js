const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DATABASE_PATH || './database.sqlite';

class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      // Ensure database directory exists
      const dbDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dbDir) && dbDir !== '.') {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('📦 Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        emailVerified INTEGER DEFAULT 0,
        resetToken TEXT,
        resetTokenExpiry INTEGER,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
      )`,

      // Products table
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        images TEXT,
        stock INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        metadata TEXT,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        status TEXT DEFAULT 'pending',
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL DEFAULT 0,
        shipping REAL DEFAULT 0,
        total REAL NOT NULL,
        shippingAddress TEXT,
        billingAddress TEXT,
        paymentIntentId TEXT,
        trackingNumber TEXT,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,

      // Order items table
      `CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        productSnapshot TEXT,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (orderId) REFERENCES orders (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      )`,

      // Wishlist table
      `CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        sessionId TEXT NOT NULL,
        userId TEXT,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (productId) REFERENCES products (id),
        FOREIGN KEY (userId) REFERENCES users (id)
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
      'CREATE INDEX IF NOT EXISTS idx_products_active ON products(isActive)',
      'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(userId)',
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
      'CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(orderId)',
      'CREATE INDEX IF NOT EXISTS idx_wishlist_session ON wishlist(sessionId)',
      'CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(userId)',
      'CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(productId)'
    ];

    for (const index of indexes) {
      await this.run(index);
    }

    console.log('✅ Database tables created successfully');
    
    // Seed initial data
    await this.seedData();
  }

  async seedData() {
    // Check if products already exist
    const existingProducts = await this.get('SELECT COUNT(*) as count FROM products');
    if (existingProducts.count > 0) {
      console.log('📦 Products already seeded');
      return;
    }

    const { v4: uuidv4 } = require('uuid');
    
    const products = [
      {
        id: '1',
        name: 'Venus Vacation PRISM - Standard Edition',
        description: 'The base game featuring all 6 Venus characters in stunning detail. Experience the tropical paradise with enhanced graphics and new gameplay mechanics.',
        price: 59.99,
        category: 'game',
        type: 'physical',
        images: JSON.stringify(['img/top-products_normal.webp']),
        stock: 100,
        metadata: JSON.stringify({
          platforms: ['PS5', 'PS4'],
          features: ['Base Game', '6 Characters', 'Story Mode'],
          releaseDate: '2024-03-07'
        })
      },
      {
        id: '2',
        name: 'Venus Vacation PRISM - Digital Deluxe Edition',
        description: 'Premium digital edition with exclusive content, season pass, and bonus outfits for all characters.',
        price: 89.99,
        category: 'game',
        type: 'digital',
        images: JSON.stringify(['img/top-products_ddx-ug-en.webp']),
        stock: 999,
        metadata: JSON.stringify({
          platforms: ['PS5', 'PS4', 'Steam'],
          features: ['Base Game', 'Season Pass', 'Exclusive Outfits', 'Digital Soundtrack'],
          releaseDate: '2024-03-07'
        })
      },
      {
        id: '3',
        name: 'Cheongsam Outfits Set',
        description: 'Beautiful traditional cheongsam outfits for all 6 characters. Early purchase bonus content.',
        price: 14.99,
        category: 'dlc',
        type: 'digital',
        images: JSON.stringify(['img/top-products_bene-early.webp']),
        stock: 999,
        metadata: JSON.stringify({
          platforms: ['PS5', 'PS4', 'Steam'],
          features: ['6 Outfits', 'All Characters', 'Early Purchase Bonus'],
          characters: ['Misaki', 'Honoka', 'Tamaki', 'Fiona', 'Nanami', 'Elise']
        })
      },
      {
        id: '4',
        name: 'Plumeria Hair Ornament Hairstyles',
        description: 'Elegant plumeria hair ornament hairstyles for all characters. Digital pre-order exclusive.',
        price: 9.99,
        category: 'dlc',
        type: 'digital',
        images: JSON.stringify(['img/top-products_bene-preorder.webp']),
        stock: 999,
        metadata: JSON.stringify({
          platforms: ['PS5', 'PS4', 'Steam'],
          features: ['6 Hairstyles', 'All Characters', 'Pre-order Bonus'],
          characters: ['Misaki', 'Honoka', 'Tamaki', 'Fiona', 'Nanami', 'Elise']
        })
      },
      {
        id: '5',
        name: 'Resort Cami Dress (Blue) - Misaki SSR',
        description: 'Exclusive SSR swimsuit for Misaki in beautiful blue. Linked purchase bonus for Venus Vacation players.',
        price: 19.99,
        category: 'dlc',
        type: 'digital',
        images: JSON.stringify(['img/top-products_bene-doaxvv-gl.webp']),
        stock: 999,
        metadata: JSON.stringify({
          platforms: ['Venus Vacation'],
          features: ['SSR Swimsuit', 'Misaki Exclusive', 'Linked Purchase Bonus'],
          character: 'Misaki',
          rarity: 'SSR'
        })
      }
    ];

    for (const product of products) {
      await this.run(
        `INSERT INTO products (id, name, description, price, category, type, images, stock, metadata) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [product.id, product.name, product.description, product.price, product.category, 
         product.type, product.images, product.stock, product.metadata]
      );
    }

    console.log('🌟 Sample products seeded successfully');
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const database = new Database();
module.exports = database;