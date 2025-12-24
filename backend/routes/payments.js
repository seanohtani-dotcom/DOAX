const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Process payment (mock implementation)
router.post('/process', async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock payment success (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      const paymentId = uuidv4();
      
      res.json({
        success: true,
        data: {
          paymentId,
          orderId,
          status: 'completed',
          amount,
          paymentMethod: paymentMethod.type,
          transactionId: `txn_${Date.now()}`,
          processedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_FAILED',
          message: 'Payment processing failed. Please try again.'
        }
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PAYMENT_ERROR',
        message: 'Payment processing error'
      }
    });
  }
});

// Get payment status
router.get('/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  
  res.json({
    success: true,
    data: {
      paymentId,
      status: 'completed',
      processedAt: new Date().toISOString()
    }
  });
});

module.exports = router;