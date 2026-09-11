const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

let pool = null;
let isConnectedToMySQL = false;

// Fallback in-memory database store (seeded with egg_shop.sql default records)
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Egg Shop Admin',
      email: 'admin@eggshop.com',
      password: bcrypt.hashSync('admin123', 10),
      phone: '+91 98401 23456',
      address: '124 Farm Gate Road, Anna Nagar',
      city: 'Chennai',
      postal_code: '600040',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('user123', 10),
      phone: '+91 98765 43210',
      address: 'No. 42, 2nd Main Road, Gandhi Nagar',
      city: 'Chennai',
      postal_code: '600028',
      role: 'customer',
      created_at: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 1,
      name: 'Country Hen Eggs | நாட்டுக் கோழி முட்டை',
      description: 'Authentic heritage free-range country chicken eggs (Nattu Kozhi). Rich in protein, deep orange yolks, and traditional natural nourishment. தூய நாட்டுக் கோழி முட்டை.',
      price: 180.00,
      pack_size: '10 pcs',
      category: 'Country Hen',
      stock: 65,
      rating: 5.0,
      num_reviews: 114,
      image_url: '/images/country_egg.png',
      is_featured: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Farm Fresh White Eggs | பண்ணை வெள்ளை முட்டை',
      description: 'Daily collected farm fresh white table eggs. Graded, washed, UV-sanitized, and high in clean protein for your daily fitness and breakfast. புதிய பண்ணை வெள்ளைக் கோழி முட்டை.',
      price: 90.00,
      pack_size: '12 pcs',
      category: 'White Egg',
      stock: 120,
      rating: 4.8,
      num_reviews: 98,
      image_url: '/images/white_egg.png',
      is_featured: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Heritage Duck Eggs | பண்ணை வாத்து முட்டை',
      description: 'Large, rich, and creamy farm fresh duck eggs. Prized for baking, fluffy omelettes, and rich micronutrients. சுவையான இயற்கை பண்ணை வாத்து முட்டை.',
      price: 210.00,
      pack_size: '6 pcs',
      category: 'Duck Egg',
      stock: 40,
      rating: 4.8,
      num_reviews: 42,
      image_url: '/images/duck_egg.jpg',
      is_featured: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Gourmet Quail Eggs | சத்து நிறைந்த காடை முட்டை',
      description: 'Healthy, nutrient-dense speckled quail eggs. Packed with iron, calcium, and vitamin B12. உடலுக்கு அதிக ஊட்டச்சத்து தரும் புதிய காடை முட்டை.',
      price: 120.00,
      pack_size: '18 pcs',
      category: 'Quail Egg',
      stock: 55,
      rating: 4.9,
      num_reviews: 63,
      image_url: '/images/quail_egg.jpg',
      is_featured: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Country Hen Eggs Jumbo Tray | நாட்டுக் கோழி முட்டை (30 எண்ணிக்கை)',
      description: 'Wholesale monthly value tray of 30 authentic country hen eggs direct from cooperative farms. 30 நாட்டு முட்டைகள் கொண்ட சேமிப்புப் பெட்டி.',
      price: 490.00,
      pack_size: '30 pcs',
      category: 'Country Hen',
      stock: 30,
      rating: 5.0,
      num_reviews: 85,
      image_url: '/images/country_egg.png',
      is_featured: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Farm White Eggs Value Tray | வெள்ளை முட்டை (30 எண்ணிக்கை)',
      description: 'Economical 30-egg tray of fresh white eggs for families, gyms, and home baking. 30 வெள்ளை முட்டைகள் கொண்ட சேமிப்புப் பெட்டி.',
      price: 220.00,
      pack_size: '30 pcs',
      category: 'White Egg',
      stock: 75,
      rating: 4.7,
      num_reviews: 76,
      image_url: '/images/white_egg.png',
      is_featured: 0,
      created_at: new Date().toISOString()
    }
  ],
  orders: [
    {
      id: 1,
      user_id: 2,
      total_amount: 390.00,
      shipping_address: '742 Anna Salai',
      city: 'Chennai',
      postal_code: '600002',
      phone: '+91 98765 43210',
      payment_method: 'UPI',
      payment_status: 'Paid',
      order_status: 'Delivered',
      delivery_slot: 'Morning (7:00 AM - 10:00 AM)',
      notes: 'Please ring the bell gently.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 2,
      user_id: 2,
      total_amount: 270.00,
      shipping_address: '742 Anna Salai',
      city: 'Chennai',
      postal_code: '600002',
      phone: '+91 98765 43210',
      payment_method: 'COD',
      payment_status: 'Pending',
      order_status: 'Processing',
      delivery_slot: 'Evening (4:00 PM - 7:00 PM)',
      notes: 'Leave with security if not answered.',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  order_items: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      name: 'Country Hen Eggs | நாட்டுக் கோழி முட்டை',
      price: 180.00,
      quantity: 1,
      image_url: '/images/country_egg.png'
    },
    {
      id: 2,
      order_id: 1,
      product_id: 3,
      name: 'Heritage Duck Eggs | பண்ணை வாத்து முட்டை',
      price: 210.00,
      quantity: 1,
      image_url: '/images/duck_egg.jpg'
    },
    {
      id: 3,
      order_id: 2,
      product_id: 2,
      name: 'Farm Fresh White Eggs | பண்ணை வெள்ளை முட்டை',
      price: 90.00,
      quantity: 1,
      image_url: '/images/white_egg.png'
    },
    {
      id: 4,
      order_id: 2,
      product_id: 4,
      name: 'Gourmet Quail Eggs | சத்து நிறைந்த காடை முட்டை',
      price: 120.00,
      quantity: 1,
      image_url: '/images/quail_egg.jpg'
    }
  ],
  dailyPrices: {
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
  }
};

async function initDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'egg_shop',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isConnectedToMySQL = true;
    console.log('✅ Connected to MySQL database successfully.');
  } catch (err) {
    isConnectedToMySQL = false;
    console.warn('⚠️  MySQL connection failed or server not running (' + err.message + ').');
    console.log('🔄 Seamlessly activated built-in data adapter for complete local functionality.');
    console.log('💡 To use MySQL: start MySQL server, run `database/egg_shop.sql`, and configure `server/.env`.');
  }
}

initDB();

const db = {
  get isConnected() {
    return isConnectedToMySQL;
  },
  get pool() {
    return pool;
  },
  get store() {
    return memoryStore;
  },
  async query(sql, params = []) {
    if (isConnectedToMySQL && pool) {
      return await pool.execute(sql, params);
    }
    return [null, null];
  }
};

module.exports = db;
