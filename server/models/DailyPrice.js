const db = require('../config/db');

class DailyPrice {
  static defaultData() {
    return {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      note: 'Namakkal NECC & TN Farm Gate Daily Benchmark Wholesale & Retail Rates',
      last_updated: new Date().toISOString(),
      updated_by: 'Egg Shop Admin',
      market_trend: 'Rising',
      items: [
        {
          id: 'white_egg',
          name: 'Farm Fresh White Egg',
          tamil_name: 'பண்ணை வெள்ளை முட்டை',
          category: 'White Egg',
          price_per_piece: 5.60,
          price_per_tray: 168.00,
          tray_size: '30 pcs',
          change: '+0.10',
          trend: 'up',
          icon: '🥚'
        },
        {
          id: 'country_egg',
          name: 'Heritage Country Hen (Nattu Kozhi)',
          tamil_name: 'நாட்டுக் கோழி முட்டை',
          category: 'Country Hen',
          price_per_piece: 13.00,
          price_per_tray: 390.00,
          tray_size: '30 pcs',
          change: '0.00',
          trend: 'steady',
          icon: '🐓'
        },
        {
          id: 'duck_egg',
          name: 'Farm Fresh Duck Egg',
          tamil_name: 'பண்ணை வாத்து முட்டை',
          category: 'Duck Egg',
          price_per_piece: 11.00,
          price_per_tray: 330.00,
          tray_size: '30 pcs',
          change: '+0.20',
          trend: 'up',
          icon: '🦆'
        },
        {
          id: 'quail_egg',
          name: 'Gourmet Quail Egg',
          tamil_name: 'சத்து நிறைந்த காடை முட்டை',
          category: 'Quail Egg',
          price_per_piece: 2.80,
          price_per_tray: 84.00,
          tray_size: '30 pcs',
          change: '0.00',
          trend: 'steady',
          icon: '🪺'
        }
      ]
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
          return {
            id: row.id,
            date: row.date,
            note: row.note,
            market_trend: row.market_trend,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
            updated_by: row.updated_by,
            last_updated: row.updated_at || row.created_at
          };
        }
      } catch (err) {
        console.warn('Could not query daily_prices from MySQL:', err.message);
      }
    }

    if (!db.store.dailyPrices) {
      db.store.dailyPrices = this.defaultData();
    }
    return db.store.dailyPrices;
  }

  static async update(payload, adminUser = null) {
    const todayStr = payload.date || new Date().toISOString().split('T')[0];
    const updaterName = adminUser?.name || 'Egg Shop Admin';

    const updatedData = {
      id: db.store.dailyPrices?.id || 1,
      date: todayStr,
      note: payload.note || 'Namakkal NECC & TN Farm Gate Daily Benchmark Wholesale & Retail Rates',
      market_trend: payload.market_trend || 'Steady',
      items: payload.items || (db.store.dailyPrices ? db.store.dailyPrices.items : this.defaultData().items),
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
