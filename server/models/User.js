const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    if (db.isConnected) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email.toLowerCase().trim()]
      );
      return rows[0] || null;
    }
    return db.store.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    ) || null;
  }

  static async findById(id) {
    const numId = Number(id);
    if (db.isConnected) {
      const [rows] = await db.pool.execute(
        'SELECT id, name, email, phone, address, city, postal_code, role, created_at FROM users WHERE id = ? LIMIT 1',
        [numId]
      );
      return rows[0] || null;
    }
    const user = db.store.users.find((u) => u.id === numId);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async create({ name, email, password, phone = '', address = '', city = '', postal_code = '', role = 'customer' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const cleanEmail = email.toLowerCase().trim();

    if (db.isConnected) {
      const [result] = await db.pool.execute(
        'INSERT INTO users (name, email, password, phone, address, city, postal_code, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, cleanEmail, hashedPassword, phone, address, city, postal_code, role]
      );
      return {
        id: result.insertId,
        name,
        email: cleanEmail,
        phone,
        address,
        city,
        postal_code,
        role
      };
    }

    const newId = db.store.users.length ? Math.max(...db.store.users.map((u) => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      address,
      city,
      postal_code,
      role,
      created_at: new Date().toISOString()
    };
    db.store.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  static async update(id, { name, phone, address, city, postal_code }) {
    const numId = Number(id);
    if (db.isConnected) {
      await db.pool.execute(
        'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, postal_code = ? WHERE id = ?',
        [name, phone, address, city, postal_code, numId]
      );
      return this.findById(numId);
    }

    const idx = db.store.users.findIndex((u) => u.id === numId);
    if (idx === -1) return null;

    db.store.users[idx] = {
      ...db.store.users[idx],
      name: name ?? db.store.users[idx].name,
      phone: phone ?? db.store.users[idx].phone,
      address: address ?? db.store.users[idx].address,
      city: city ?? db.store.users[idx].city,
      postal_code: postal_code ?? db.store.users[idx].postal_code
    };
    const { password: _, ...safeUser } = db.store.users[idx];
    return safeUser;
  }

  static async findAll() {
    if (db.isConnected) {
      const [rows] = await db.pool.execute(
        'SELECT id, name, email, phone, address, city, postal_code, role, created_at FROM users ORDER BY id DESC'
      );
      return rows;
    }
    return db.store.users.map(({ password, ...u }) => u);
  }

  static async updateRole(id, role) {
    const numId = Number(id);
    if (db.isConnected) {
      await db.pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, numId]);
      return this.findById(numId);
    }
    const idx = db.store.users.findIndex((u) => u.id === numId);
    if (idx !== -1) {
      db.store.users[idx].role = role;
      const { password: _, ...safeUser } = db.store.users[idx];
      return safeUser;
    }
    return null;
  }
}

module.exports = User;
