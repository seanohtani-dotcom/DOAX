const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ORDER',
          message: 'Order must contain at least one item'
        }
      });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (!product) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: `Product ${item.productId} not found`
          }
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        id: uuidv4(),
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        productSnapshot: JSON.stringify(product)
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = items.some(item => item.product?.type === 'physical') ? 9.99 : 0;
    const total = subtotal + tax + shipping;

    // Create order
    const orderId = uuidv4();
    await db.run(
      `INSERT INTO orders (id, status, items, subtotal, tax, shipping, total, shippingAddress, billingAddress) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        'pending',
        JSON.stringify(items),
        subtotal,
        tax,
        shipping,
        total,
        JSON.stringify(shippingAddress),
        JSON.stringify(billingAddress)
      ]
    );

    // Create order items
    for (const item of orderItems) {
      await db.run(
        `INSERT INTO order_items (id, orderId, productId, quantity, price, productSnapshot) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [item.id, orderId, item.productId, item.quantity, item.price, item.productSnapshot]
      );
    }

    res.status(201).json({
      success: true,
      data: {
        orderId,
        status: 'pending',
        subtotal,
        tax,
        shipping,
        total,
        items: orderItems.length
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ORDER_CREATION_ERROR',
        message: 'Failed to create order'
      }
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    // Get order items
    const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [id]);

    const formattedOrder = {
      ...order,
      items: JSON.parse(order.items || '[]'),
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
      billingAddress: JSON.parse(order.billingAddress || '{}'),
      orderItems: items.map(item => ({
        ...item,
        productSnapshot: JSON.parse(item.productSnapshot || '{}')
      }))
    };

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ORDER_ERROR',
        message: 'Failed to fetch order'
      }
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Invalid order status'
        }
      });
    }

    await db.run(
      'UPDATE orders SET status = ?, updatedAt = strftime("%s", "now") WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      data: { orderId: id, status }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_ORDER_ERROR',
        message: 'Failed to update order status'
      }
    });
  }
});

module.exports = router;