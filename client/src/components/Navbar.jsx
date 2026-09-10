import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShieldCheck, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-amber-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-1.5 tracking-tight">
        <Sparkles size={14} className="text-amber-400 flex-shrink-0" />
        <span className="truncate">100% Pure Egg Shop • Fresh Morning Harvest • Free Delivery Above 30 Eggs (30 முட்டைகளுக்கு மேல் இலவச டெலிவரி)</span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-xl sm:text-2xl group-hover:scale-105 transition-transform">
              🥚
            </div>
            <div>
              <div className="font-extrabold text-xl sm:text-2xl text-dark tracking-tight leading-none font-heading">
                Egg<span className="text-primary">Haven</span>
              </div>
              <div className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Farm Fresh Daily
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-semibold">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`transition-colors ${isActive('/admin') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className={`transition-colors ${isActive('/admin/products') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                >
                  Inventory
                </Link>
                <Link
                  to="/admin/orders"
                  className={`transition-colors ${isActive('/admin/orders') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/users"
                  className={`transition-colors ${isActive('/admin/users') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                >
                  Users
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  View Store
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`transition-colors ${isActive('/') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`transition-colors ${isActive('/products') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                >
                  Egg Varieties
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-orders"
                    className={`transition-colors ${isActive('/my-orders') ? 'text-primary-dark font-bold' : 'text-slate-700 hover:text-primary-dark'}`}
                  >
                    My Orders
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Trigger */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ShoppingBag size={20} className="text-dark" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Actions */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs sm:text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block font-semibold text-xs sm:text-sm text-slate-800 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                    <div className="p-2.5 border-b border-slate-100">
                      <div className="text-[11px] font-medium text-slate-400">Signed in as</div>
                      <div className="font-bold text-xs text-dark truncate">
                        {user?.email}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                    >
                      <User size={15} /> My Account
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                    >
                      <ShoppingBag size={15} /> Order History
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-purple-700 bg-purple-50/60 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                      >
                        <ShieldCheck size={15} /> Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1.5" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-2.5 shadow-md">
          {isAdmin ? (
            <>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-primary-dark py-1.5">
                Dashboard Overview
              </Link>
              <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                Manage Inventory
              </Link>
              <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                Manage Orders
              </Link>
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                User Accounts
              </Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-blue-600 py-1.5">
                View Store
              </Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                Home
              </Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                Egg Varieties
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                    My Orders
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1.5">
                    My Account
                  </Link>
                </>
              )}
            </>
          )}

          {!isAuthenticated && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="w-full text-center py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
