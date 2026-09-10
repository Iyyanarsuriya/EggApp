const db = require('../config/db');
const OrderItem = require('./OrderItem');

class Order {
  static async create({
    user_id,
    total_amount,
    shipping_address,
    city,
    postal_code,
    phone,
    payment_method = 'COD',
    payment_status = 'Pending',
    order_status = 'Pending',
    delivery_slot = 'Morning (7:00 AM - 10:00 AM)',
    notes = '',
    items = []
  }) {
    let orderId;

    if (db.isConnected) {
      const [result] = await db.pool.execute(
        `INSERT INTO orders (user_id, total_amount, shipping_address, city, postal_code, phone, payment_method, payment_status, order_status, delivery_slot, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          total_amount,
          shipping_address,
          city,
          postal_code,
          phone,
          payment_method,
          payment_status,
          order_status,
          delivery_slot,
          notes
        ]
      );
      orderId = result.insertId;
    } else {
      orderId = db.store.orders.length
        ? Math.max(...db.store.orders.map((o) => o.id)) + 1
        : 1;
      const newOrder = {
        id: orderId,
        user_id,
        total_amount: Number(total_amount),
        shipping_address,
        city,
        postal_code,
        phone,
        payment_method,
        payment_status,
        order_status,
        delivery_slot,
        notes,
        created_at: new Date().toISOString()
      };
      db.store.orders.unshift(newOrder);
    }

    // Insert line items
    const createdItems = [];
    for (const item of items) {
      const savedItem = await OrderItem.create({
        order_id: orderId,
        product_id: item.product_id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      });
      createdItems.push(savedItem);
    }

    return { ...(await this.findById(orderId)), items: createdItems };
  }

  static async findById(id) {
    const numId = Number(id);
    let order = null;

    if (db.isConnected) {
      const [rows] = await db.pool.execute(
        `SELECT o.*, u.name as user_name, u.email as user_email 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         WHERE o.id = ? LIMIT 1`,
        [numId]
      );
      order = rows[0] || null;
    } else {
      order = db.store.orders.find((o) => o.id === numId) || null;
      if (order) {
        const user = db.store.users.find((u) => u.id === order.user_id);
        order = { ...order, user_name: user ? user.name : 'Unknown', user_email: user ? user.email : '' };
      }
    }

    if (!order) return null;
    const items = await OrderItem.findByOrderId(numId);
    return { ...order, items };
  }

  static async findByUserId(userId) {
    const numUserId = Number(userId);
    let userOrders = [];

    if (db.isConnected) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
        [numUserId]
      );
      userOrders = rows;
    } else {
      userOrders = db.store.orders
        .filter((o) => o.user_id === numUserId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const fullOrders = await Promise.all(
      userOrders.map(async (ord) => {
        const items = await OrderItem.findByOrderId(ord.id);
        return { ...ord, items };
      })
    );

    return fullOrders;
  }

  static async findAll() {
    let allOrders = [];

    if (db.isConnected) {
      const [rows] = await db.pool.execute(
        `SELECT o.*, u.name as user_name, u.email as user_email 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         ORDER BY o.id DESC`
      );
      allOrders = rows;
    } else {
      allOrders = db.store.orders
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((ord) => {
          const user = db.store.users.find((u) => u.id === ord.user_id);
          return {
            ...ord,
            user_name: user ? user.name : 'Customer',
            user_email: user ? user.email : ''
          };
        });
    }

    return await Promise.all(
      allOrders.map(async (ord) => {
        const items = await OrderItem.findByOrderId(ord.id);
        return { ...ord, items };
      })
    );
  }

  static async updateStatus(id, { order_status, payment_status }) {
    const numId = Number(id);

    if (db.isConnected) {
      await db.pool.execute(
        `UPDATE orders SET 
          order_status = COALESCE(?, order_status),
          payment_status = COALESCE(?, payment_status)
        WHERE id = ?`,
        [order_status ?? null, payment_status ?? null, numId]
      );
      return this.findById(numId);
    }

    const idx = db.store.orders.findIndex((o) => o.id === numId);
    if (idx !== -1) {
      if (order_status) db.store.orders[idx].order_status = order_status;
      if (payment_status) db.store.orders[idx].payment_status = payment_status;
      return this.findById(numId);
    }
    return null;
  }
}

module.exports = Order;
