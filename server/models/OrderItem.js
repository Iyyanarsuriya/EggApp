const db = require('../config/db');

class OrderItem {
  static async create({ order_id, product_id, name, price, quantity, image_url }) {
    if (db.isConnected) {
      const [result] = await db.pool.execute(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [order_id, product_id, name, price, quantity, image_url]
      );
      return { id: result.insertId, order_id, product_id, name, price, quantity, image_url };
    }

    const newId = db.store.order_items.length
      ? Math.max(...db.store.order_items.map((item) => item.id)) + 1
      : 1;
    const newItem = {
      id: newId,
      order_id,
      product_id,
      name,
      price: Number(price),
      quantity: Number(quantity),
      image_url
    };
    db.store.order_items.push(newItem);
    return newItem;
  }

  static async findByOrderId(orderId) {
    const numId = Number(orderId);
    if (db.isConnected) {
      const [rows] = await db.pool.execute('SELECT * FROM order_items WHERE order_id = ?', [numId]);
      return rows;
    }
    return db.store.order_items.filter((item) => item.order_id === numId);
  }
}

module.exports = OrderItem;
