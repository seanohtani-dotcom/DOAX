const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');

// Get user's wishlist
router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SESSION',
          message: 'Session ID required'
        }
      });
    }

    const wishlistItems = await db.all(
      `SELECT w.*, p.* FROM wishlist w 
       JOIN products p ON w.productId = p.id 
       WHERE w.sessionId = ? AND p.isActive = 1 
       ORDER BY w.createdAt DESC`,
      [sessionId]
    );

    const formattedItems = wishlistItems.map(item => ({
      id: item.id,
      productId: item.productId,
      addedAt: item.createdAt,
      product: {
        id: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        type: item.type,
        images: JSON.parse(item.images || '[]'),
        metadata: JSON.parse(item.metadata || '{}')
      }
    }));

    res.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_WISHLIST_ERROR',
        message: 'Failed to fetch wishlist'
      }
    });
  }
});

// Add item to wishlist
router.post('/add', async (req, res) => {
  try {
    const { productId, sessionId } = req.body;

    if (!productId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DATA',
          message: 'Product ID and session ID required'
        }
      });
    }

    // Check if product exists
    const product = await db.get('SELECT * FROM products WHERE id = ? AND isActive = 1', [productId]);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    // Check if already in wishlist
    const existing = await db.get('SELECT id FROM wishlist WHERE productId = ? AND sessionId = ?', [productId, sessionId]);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_IN_WISHLIST',
          message: 'Product already in wishlist'
        }
      });
    }

    // Add to wishlist
    const wishlistId = uuidv4();
    await db.run(
      'INSERT INTO wishlist (id, productId, sessionId) VALUES (?, ?, ?)',
      [wishlistId, productId, sessionId]
    );

    res.status(201).json({
      success: true,
      data: {
        id: wishlistId,
        productId,
        product: {
          ...product,
          images: JSON.parse(product.images || '[]'),
          metadata: JSON.parse(product.metadata || '{}')
        }
      }
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_WISHLIST_ERROR',
        message: 'Failed to add item to wishlist'
      }
    });
  }
});

// Remove item from wishlist
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SESSION',
          message: 'Session ID required'
        }
      });
    }

    const result = await db.run(
      'DELETE FROM wishlist WHERE productId = ? AND sessionId = ?',
      [productId, sessionId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Item not found in wishlist'
        }
      });
    }

    res.json({
      success: true,
      data: { productId, removed: true }
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REMOVE_WISHLIST_ERROR',
        message: 'Failed to remove item from wishlist'
      }
    });
  }
});

// Clear entire wishlist
router.delete('/', async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SESSION',
          message: 'Session ID required'
        }
      });
    }

    await db.run('DELETE FROM wishlist WHERE sessionId = ?', [sessionId]);

    res.json({
      success: true,
      data: { cleared: true }
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CLEAR_WISHLIST_ERROR',
        message: 'Failed to clear wishlist'
      }
    });
  }
});

module.exports = router;