# 🥚 Egg Haven — Farm-Fresh Egg Shop E-Commerce Platform

A complete, full-stack e-commerce web application engineered for artisanal and pasture-raised egg distribution. Built with React (Vite) on the frontend, Node.js + Express on the backend, and MySQL database schema with seamless local fallback support.

---

## 📁 Repository Structure

```text
├── client/                         # React Frontend (Vite)
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Users.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── .env
│
├── server/                         # Node.js + Express
│   ├── config/
│   │   └── db.js                  # MySQL connection with smart local fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── OrderItem.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── database/
│   └── egg_shop.sql               # MySQL Table Schemas & Initial Seed Data
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Database Setup (MySQL)
Import the database schema and sample egg varieties:
```bash
mysql -u root -p < database/egg_shop.sql
```
*Note: If MySQL is not running or installed locally, the server features an automatic built-in fallback data engine so you can test all features right away without configuration!*

### 2. Backend Server Setup
```bash
cd server
npm install
npm run dev   # or: npm start
```
The API server runs at `http://localhost:5000`.

### 3. Frontend Client Setup
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The frontend will launch at `http://localhost:5173`.

---

## 🔑 Demo Accounts

For immediate testing, use the **1-Click Demo Login** buttons on the Login page or enter:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eggshop.com` | `admin123` | Full Admin Dashboard, Inventory, Orders, User Roles |
| **Customer** | `john@example.com` | `user123` | Shop, Cart, Checkout, Order Tracking, Profile |

---

## 🌟 Key Features

1. **Egg Catalog & Search**:
   - Filter by egg varieties: *Pasture Raised*, *Country Hen (Nattu Kozhi)*, *Japanese Quail*, *Heritage Duck*, *Omega-3 Fortified*, *Farm White*, *Bulk Catering Trays*.
   - Instant search and multi-criteria sorting (Featured, Price, Rating).
2. **Product Details & Nutrition**:
   - High-resolution gallery, nutritional profiling (Protein, Vitamins, Omega-3), pack size selector, stock counters.
3. **Cart & Free Shipping Progress Bar**:
   - Real-time total calculation, free delivery threshold meter ($20), discount coupons (`EGGFRESH10`).
4. **Frictionless Checkout**:
   - Delivery address selection, delivery time slots (Morning, Afternoon, Evening), payment options (COD, UPI, Card).
5. **Live Order Tracking**:
   - Visual 4-stage delivery timeline (*Order Received* ➔ *Candled & Packed* ➔ *Out in Chilled Van* ➔ *Delivered*).
6. **Executive Admin Dashboard**:
   - Revenue, order volume, and customer metrics.
   - Real-time low stock warnings.
   - Inventory Management: Add, edit, delete egg varieties, prices, and stock.
   - Order Fulfillment: Update statuses and manage logistics.
   - User Accounts: Customer management and role assignments.
