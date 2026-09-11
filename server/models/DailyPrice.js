const db = require('../config/db');
const Product = require('./Product');

class DailyPrice {
  static getCategoryIcon(category = '') {
    const cat = category.toLowerCase();
    if (cat.includes('country') || cat.includes('nattu')) return '🐓';
    if (cat.includes('white')) return '🥚';
    if (cat.includes('duck')) return '🦆';
    if (cat.includes('quail')) return '🪺';
    return '🥚';
  }

  static getCategorySortRank(category = '', name = '') {
    const text = `${category} ${name}`.toLowerCase();
    if (text.includes('white')) return 1;
    if (text.includes('country') || text.includes('nattu')) return 2;
    if (text.includes('duck')) return 3;
    if (text.includes('quail') || text.includes('kaada') || text.includes('kada')) return 4;
    return 5;
  }

  static sortItems(items = []) {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      const rankA = this.getCategorySortRank(a.category, a.name);
      const rankB = this.getCategorySortRank(b.category, b.name);
      return rankA - rankB;
    });
  }

  static async generateFromProducts() {
    const products = await Product.findAll();

    // Group by category to derive live baseline rates from active database inventory
    const categoryMap = new Map();
    products.forEach((p) => {
      if (!categoryMap.has(p.category)) {
        categoryMap.set(p.category, p);
      }
    });

    const items = Array.from(categoryMap.values()).map((p) => {
      const packPcs = parseInt(p.pack_size, 10) || 1;
      const pieceRate = Number((Number(p.price) / packPcs).toFixed(2));
      const trayRate = Math.round(pieceRate * 30);
      const nameParts = p.name.split('|');
      const englishName = nameParts[0]?.trim() || p.name;
      const tamilName = nameParts[1]?.trim() || '';

      return {
        id: `egg_${p.id}`,
        product_id: p.id,
        name: englishName,
        tamil_name: tamilName,
        category: p.category,
        price_per_piece: pieceRate,
        price_per_tray: trayRate,
        tray_size: '30 pcs',
        change: '0.00',
        trend: 'steady',
        icon: this.getCategoryIcon(p.category)
      };
    });

    const sortedItems = this.sortItems(items);

    return {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      note: 'Live Farm Gate Wholesale & Retail Benchmark Rates',
      last_updated: new Date().toISOString(),
      updated_by: 'Database Sync',
      market_trend: 'Steady',
      items: sortedItems
    };
  }

  static async ensureTable() {
    if (db.isConnected && db.pool) {
      try {
        const sql = `
          CREATE TABLE IF NOT EXISTS daily_prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date VARCHAR(20) NOT NULL,
            note TEXT,
            market_trend VARCHAR(50) DEFAULT 'Steady',
            items JSON NOT NULL,
            updated_by VARCHAR(100) DEFAULT 'Admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await db.pool.execute(sql);
      } catch (e) {
        console.warn('daily_prices table ensure warning:', e.message);
      }
    }
  }

  static async getLatest() {
    if (db.isConnected && db.pool) {
      try {
        await this.ensureTable();
        const [rows] = await db.pool.execute('SELECT * FROM daily_prices ORDER BY id DESC LIMIT 1');
        if (rows && rows.length > 0) {
          const row = rows[0];
          const rawItems = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
          return {
            id: row.id,
            date: row.date,
            note: row.note,
            market_trend: row.market_trend,
            items: this.sortItems(rawItems),
            updated_by: row.updated_by,
            last_updated: row.updated_at || row.created_at
          };
        }
      } catch (err) {
        console.warn('Could not query daily_prices from MySQL:', err.message);
      }
    }

    if (db.store.dailyPrices) {
      if (Array.isArray(db.store.dailyPrices.items)) {
        db.store.dailyPrices.items = this.sortItems(db.store.dailyPrices.items);
      }
      return db.store.dailyPrices;
    }

    // Derive automatically from real database products instead of static mock numbers
    const generated = await this.generateFromProducts();
    db.store.dailyPrices = generated;
    return generated;
  }

  static async update(payload, adminUser = null) {
    const todayStr = payload.date || new Date().toISOString().split('T')[0];
    const updaterName = adminUser?.name || 'Egg Shop Admin';
    const sortedItems = this.sortItems(payload.items || []);

    const updatedData = {
      id: db.store.dailyPrices?.id || 1,
      date: todayStr,
      note: payload.note || 'Live Farm Gate Wholesale & Retail Rates',
      market_trend: payload.market_trend || 'Steady',
      items: sortedItems,
      updated_by: updaterName,
      last_updated: new Date().toISOString()
    };

    // Update memory store
    db.store.dailyPrices = updatedData;

    // Persist to MySQL if available
    if (db.isConnected && db.pool) {
      try {
        await this.ensureTable();
        const itemsJson = JSON.stringify(updatedData.items);
        const [result] = await db.pool.execute(
          'INSERT INTO daily_prices (date, note, market_trend, items, updated_by) VALUES (?, ?, ?, ?, ?)',
          [updatedData.date, updatedData.note, updatedData.market_trend, itemsJson, updatedData.updated_by]
        );
        updatedData.id = result.insertId;
      } catch (err) {
        console.error('Failed to insert daily price into MySQL:', err.message);
      }
    }

    return updatedData;
  }
}

module.exports = DailyPrice;
