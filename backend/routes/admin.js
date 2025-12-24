const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM orders';
    const params = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const orders = await db.all(sql, params);
    
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || '[]'),
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
      billingAddress: JSON.parse(order.billingAddress || '{}')
    }));
    
    res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: formattedOrders.length
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ORDERS_ERROR',
        message: 'Failed to fetch orders'
      }
    });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await db.get('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await db.get('SELECT SUM(total) as revenue FROM orders WHERE status != "cancelled"');
    const pendingOrders = await db.get('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    const totalProducts = await db.get('SELECT COUNT(*) as count FROM products WHERE isActive = 1');
    
    res.json({
      success: true,
      data: {
        totalOrders: totalOrders.count || 0,
        totalRevenue: totalRevenue.revenue || 0,
        pendingOrders: pendingOrders.count || 0,
        totalProducts: totalProducts.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_STATS_ERROR',
        message: 'Failed to fetch dashboard stats'
      }
    });
  }
});

module.exports = router;