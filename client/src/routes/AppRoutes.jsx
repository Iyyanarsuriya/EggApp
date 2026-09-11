import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

// Public Pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyOrders from '../pages/MyOrders';
import Profile from '../pages/Profile';

// Admin Pages
import Dashboard from '../admin/Dashboard';
import DailyPrices from '../admin/DailyPrices';
import AdminProducts from '../admin/Products';
import AdminOrders from '../admin/Orders';
import AdminUsers from '../admin/Users';

// Customer Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24"><Loader text="Verifying credentials..." /></div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ redirect: location.pathname }} replace />
  );
};

// Admin Protected Route Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24"><Loader text="Checking administrative permissions..." /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ redirect: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest Only Route Guard (for Login & Register)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="py-24"><Loader text="Loading..." /></div>;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/products'} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />

      {/* Guest Only Routes (hidden if already logged in) */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Authenticated Customer Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/daily-prices"
        element={
          <AdminRoute>
            <DailyPrices />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="text-center py-24 px-4">
            <div className="text-5xl mb-4">🥚</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mb-2">Page Not Found</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto my-4">
              The egg carton you're looking for seems to have moved or hatched.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-md text-sm"
            >
              Return Home
            </Link>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
