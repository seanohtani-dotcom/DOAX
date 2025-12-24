const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, type, search, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM products WHERE isActive = 1';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const products = await db.all(sql, params);
    
    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      metadata: JSON.parse(product.metadata || '{}'),
      isActive: Boolean(product.isActive),
      emailVerified: Boolean(product.emailVerified)
    }));
    
    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: formattedProducts.length
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_PRODUCTS_ERROR',
        message: 'Failed to fetch products'
      }
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await db.get('SELECT * FROM products WHERE id = ? AND isActive = 1', [id]);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }
    
    // Parse JSON fields
    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      metadata: JSON.parse(product.metadata || '{}'),
      isActive: Boolean(product.isActive)
    };
    
    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_PRODUCT_ERROR',
        message: 'Failed to fetch product'
      }
    });
  }
});

// Get products by category (for the website sections)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await db.all(
      'SELECT * FROM products WHERE category = ? AND isActive = 1 ORDER BY createdAt DESC',
      [category]
    );
    
    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      metadata: JSON.parse(product.metadata || '{}'),
      isActive: Boolean(product.isActive)
    }));
    
    res.json({
      success: true,
      data: formattedProducts
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_CATEGORY_ERROR',
        message: 'Failed to fetch products by category'
      }
    });
  }
});

module.exports = router;