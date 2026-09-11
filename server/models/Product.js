const db = require('../config/db');

class Product {
  static getCategorySortRank(category = '', name = '') {
    const text = `${category} ${name}`.toLowerCase();
    if (text.includes('white')) return 1;
    if (text.includes('country') || text.includes('nattu')) return 2;
    if (text.includes('duck')) return 3;
    if (text.includes('quail') || text.includes('kaada') || text.includes('kada')) return 4;
    return 5;
  }

  static async findAll({ category, search, featured, sort } = {}) {
    if (db.isConnected) {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'All') {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (featured) {
        sql += ' AND is_featured = 1';
      }

      if (sort === 'price-low') {
        sql += ' ORDER BY price ASC';
      } else if (sort === 'price-high') {
        sql += ' ORDER BY price DESC';
      } else if (sort === 'rating') {
        sql += ' ORDER BY rating DESC';
      } else {
        sql += ` ORDER BY 
          CASE 
            WHEN LOWER(category) LIKE '%white%' OR LOWER(name) LIKE '%white%' THEN 1
            WHEN LOWER(category) LIKE '%country%' OR LOWER(name) LIKE '%country%' OR LOWER(name) LIKE '%nattu%' THEN 2
            WHEN LOWER(category) LIKE '%duck%' OR LOWER(name) LIKE '%duck%' THEN 3
            WHEN LOWER(category) LIKE '%quail%' OR LOWER(name) LIKE '%quail%' THEN 4
            ELSE 5 
          END ASC, id ASC`;
      }

      const [rows] = await db.pool.execute(sql, params);
      return rows;
    }

    let results = [...db.store.products];

    if (category && category !== 'All') {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (featured) {
      results = results.filter((p) => p.is_featured);
    }

    if (sort === 'price-low') {
      results.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price-high') {
      results.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'rating') {
      results.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else {
      results.sort((a, b) => {
        const rankA = this.getCategorySortRank(a.category, a.name);
        const rankB = this.getCategorySortRank(b.category, b.name);
        if (rankA !== rankB) return rankA - rankB;
        return a.id - b.id;
      });
    }

    return results;
  }

  static async findById(id) {
    const numId = Number(id);
    if (db.isConnected) {
      const [rows] = await db.pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [numId]);
      return rows[0] || null;
    }
    return db.store.products.find((p) => p.id === numId) || null;
  }

  static async create(productData) {
    const {
      name,
      description,
      price,
      pack_size = '12 pcs',
      category = 'Country Hen',
      stock = 50,
      rating = 4.8,
      num_reviews = 1,
      image_url,
      is_featured = 0
    } = productData;

    if (db.isConnected) {
      const [result] = await db.pool.execute(
        `INSERT INTO products (name, description, price, pack_size, category, stock, rating, num_reviews, image_url, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, pack_size, category, stock, rating, num_reviews, image_url, is_featured ? 1 : 0]
      );
      return this.findById(result.insertId);
    }

    const newId = db.store.products.length ? Math.max(...db.store.products.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name,
      description,
      price: Number(price),
      pack_size,
      category,
      stock: Number(stock),
      rating: Number(rating),
      num_reviews: Number(num_reviews),
      image_url,
      is_featured: is_featured ? 1 : 0,
      created_at: new Date().toISOString()
    };
    db.store.products.push(newProduct);
    return newProduct;
  }

  static async update(id, productData) {
    const numId = Number(id);
    const {
      name,
      description,
      price,
      pack_size,
      category,
      stock,
      rating,
      num_reviews,
      image_url,
      is_featured
    } = productData;

    if (db.isConnected) {
      await db.pool.execute(
        `UPDATE products SET 
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          pack_size = COALESCE(?, pack_size),
          category = COALESCE(?, category),
          stock = COALESCE(?, stock),
          rating = COALESCE(?, rating),
          num_reviews = COALESCE(?, num_reviews),
          image_url = COALESCE(?, image_url),
          is_featured = COALESCE(?, is_featured)
        WHERE id = ?`,
        [
          name ?? null,
          description ?? null,
          price ?? null,
          pack_size ?? null,
          category ?? null,
          stock ?? null,
          rating ?? null,
          num_reviews ?? null,
          image_url ?? null,
          is_featured !== undefined ? (is_featured ? 1 : 0) : null,
          numId
        ]
      );
      return this.findById(numId);
    }

    const idx = db.store.products.findIndex((p) => p.id === numId);
    if (idx === -1) return null;

    db.store.products[idx] = {
      ...db.store.products[idx],
      name: name ?? db.store.products[idx].name,
      description: description ?? db.store.products[idx].description,
      price: price !== undefined ? Number(price) : db.store.products[idx].price,
      pack_size: pack_size ?? db.store.products[idx].pack_size,
      category: category ?? db.store.products[idx].category,
      stock: stock !== undefined ? Number(stock) : db.store.products[idx].stock,
      rating: rating !== undefined ? Number(rating) : db.store.products[idx].rating,
      num_reviews: num_reviews !== undefined ? Number(num_reviews) : db.store.products[idx].num_reviews,
      image_url: image_url ?? db.store.products[idx].image_url,
      is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : db.store.products[idx].is_featured
    };

    return db.store.products[idx];
  }

  static async delete(id) {
    const numId = Number(id);
    if (db.isConnected) {
      const [result] = await db.pool.execute('DELETE FROM products WHERE id = ?', [numId]);
      return result.affectedRows > 0;
    }
    const idx = db.store.products.findIndex((p) => p.id === numId);
    if (idx !== -1) {
      db.store.products.splice(idx, 1);
      return true;
    }
    return false;
  }
}

module.exports = Product;
