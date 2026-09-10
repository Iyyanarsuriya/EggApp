const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shipping_address,
      city,
      postal_code,
      phone,
      payment_method,
      delivery_slot,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!shipping_address || !city || !postal_code || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping details' });
    }

    // Calculate total amount
    const total_amount = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const payment_status = payment_method === 'COD' ? 'Pending' : 'Paid';

    const order = await Order.create({
      user_id: req.user.id,
      total_amount,
      shipping_address,
      city,
      postal_code,
      phone,
      payment_method: payment_method || 'COD',
      payment_status,
      order_status: 'Pending',
      delivery_slot: delivery_slot || 'Morning (7:00 AM - 10:00 AM)',
      notes: notes || '',
      items
    });

    // Optionally decrease stock
    for (const item of items) {
      const prodId = item.product_id || item.id;
      const prod = await Product.findById(prodId);
      if (prod) {
        const remainingStock = Math.max(0, prod.stock - item.quantity);
        await Product.update(prodId, { stock: remainingStock });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: admin or owner
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { order_status, payment_status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updated = await Order.updateStatus(req.params.id, {
      order_status,
      payment_status
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
